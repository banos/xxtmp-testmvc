/*global ko, Router */
(function () {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	// A factory function we can use to create binding handlers for specific
	// keycodes.
	function keyhandlerBindingFactory(keyCode) {
		return {
			init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
				var wrappedHandler, newValueAccessor;

				// wrap the handler with a check for the enter key
				wrappedHandler = function (data, event) {
					if (event.keyCode === keyCode) {
						valueAccessor().call(this, data, event);
					}
				};

				// create a valueAccessor with the options that we would want to pass to the event binding
				newValueAccessor = function () {
					return {
						keyup: wrappedHandler
					};
				};

				// call the real event binding's init function
				ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
			}
		};
	}

	// a custom binding to handle the enter key
	ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

	// another custom binding, this time to handle the escape key
	ko.bindingHandlers.escapeKey = keyhandlerBindingFactory(ESCAPE_KEY);

	// wrapper to hasFocus that also selects text and applies focus async
	ko.bindingHandlers.selectAndFocus = {
		init: function (element, valueAccessor, allBindingsAccessor, bindingContext) {
			ko.bindingHandlers.hasFocus.init(element, valueAccessor, allBindingsAccessor, bindingContext);
			ko.utils.registerEventHandler(element, 'focus', function () {
				element.focus();
			});
		},
		update: function (element, valueAccessor) {
			ko.utils.unwrapObservable(valueAccessor()); // for dependency
			// ensure that element is visible before trying to focus
			setTimeout(function () {
				ko.bindingHandlers.hasFocus.update(element, valueAccessor);
			}, 0);
		}
	};

	// represent a single tobuy item
	var Tobuy = function (title, completed) {
		this.title = ko.observable(title);
		this.completed = ko.observable(completed);
		this.editing = ko.observable(false);
	};

	// our main view model
	var ViewModel = function (tobuys) {
		// map array of passed in tobuys to an observableArray of Tobuy objects
		this.tobuys = ko.observableArray(tobuys.map(function (tobuy) {
			return new Tobuy(tobuy.title, tobuy.completed);
		}));

		// store the new tobuy value being entered
		this.current = ko.observable();

		this.showMode = ko.observable('all');

		this.filteredTobuys = ko.computed(function () {
			switch (this.showMode()) {
			case 'active':
				return this.tobuys().filter(function (tobuy) {
					return !tobuy.completed();
				});
			case 'completed':
				return this.tobuys().filter(function (tobuy) {
					return tobuy.completed();
				});
			default:
				return this.tobuys();
			}
		}.bind(this));

		// add a new tobuy, when enter key is pressed
		this.add = function () {
			var current = this.current().trim();
			if (current) {
				this.tobuys.push(new Tobuy(current));
				this.current('');
			}
		}.bind(this);

		// remove a single tobuy
		this.remove = function (tobuy) {
			this.tobuys.remove(tobuy);
		}.bind(this);

		// remove all completed tobuys
		this.removeCompleted = function () {
			this.tobuys.remove(function (tobuy) {
				return tobuy.completed();
			});
		}.bind(this);

		// edit an item
		this.editItem = function (item) {
			item.editing(true);
			item.previousTitle = item.title();
		}.bind(this);

		// stop editing an item.  Remove the item, if it is now empty
		this.saveEditing = function (item) {
			item.editing(false);

			var title = item.title();
			var trimmedTitle = title.trim();

			// Observable value changes are not triggered if they're consisting of whitespaces only
			// Therefore we've to compare untrimmed version with a trimmed one to chech whether anything changed
			// And if yes, we've to set the new value manually
			if (title !== trimmedTitle) {
				item.title(trimmedTitle);
			}

			if (!trimmedTitle) {
				this.remove(item);
			}
		}.bind(this);

		// cancel editing an item and revert to the previous content
		this.cancelEditing = function (item) {
			item.editing(false);
			item.title(item.previousTitle);
		}.bind(this);

		// count of all completed tobuys
		this.completedCount = ko.computed(function () {
			return this.tobuys().filter(function (tobuy) {
				return tobuy.completed();
			}).length;
		}.bind(this));

		// count of tobuys that are not complete
		this.remainingCount = ko.computed(function () {
			return this.tobuys().length - this.completedCount();
		}.bind(this));

		// writeable computed observable to handle marking all complete/incomplete
		this.allCompleted = ko.computed({
			//always return true/false based on the done flag of all tobuys
			read: function () {
				return !this.remainingCount();
			}.bind(this),
			// set all tobuys to the written value (true/false)
			write: function (newValue) {
				this.tobuys().forEach(function (tobuy) {
					// set even if value is the same, as subscribers are not notified in that case
					tobuy.completed(newValue);
				});
			}.bind(this)
		});

		// helper function to keep expressions out of markup
		this.getLabel = function (count) {
			return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
		}.bind(this);

		// internal computed observable that fires whenever anything changes in our tobuys
		ko.computed(function () {
			// store a clean copy to local storage, which also creates a dependency on
			// the observableArray and all observables in each item
			localStorage.setItem('tobuys-knockoutjs', ko.toJSON(this.tobuys));
		}.bind(this)).extend({
			rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
		}); // save at most twice per second
	};

	// check local storage for tobuys
	var tobuys = ko.utils.parseJson(localStorage.getItem('tobuys-knockoutjs'));

	// bind a new instance of our view model to the page
	var viewModel = new ViewModel(tobuys || []);
	ko.applyBindings(viewModel);

	// set up filter routing
	/*jshint newcap:false */
	Router({ '/:filter': viewModel.showMode }).init();
}());
