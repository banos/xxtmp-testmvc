/*global define, ko */
define([
	'bower_components/durandal/app',
	'js/viewmodels/shell'
], function (app, shell) {
	'use strict';

	// represent a single tobuy item
	var Todo = function (title, completed) {
		this.title = ko.observable(title);
		this.completed = ko.observable(completed);
	};

	var ViewModel = function () {
		var self = this;

		self.activate = function () {
			// initialize the show mode
			var filter = shell.filter;

			if (filter === undefined) {
				filter = 'all';
			}

			self.showMode(filter);

			// check local storage for tobuys
			var tobuysFromlocalStorage = ko.utils.parseJson(localStorage.getItem('tobuys-durandal'));

			tobuysFromlocalStorage = ko.utils.arrayMap(tobuysFromlocalStorage, function (tobuy) {
				return new Todo(tobuy.title, tobuy.completed);
			});

			self.tobuys(tobuysFromlocalStorage);

			// internal computed observable that fires whenever anything changes in
			// our tobuys
			ko.computed(function () {
				// store a clean copy to local storage, which also creates a dependency
				// on the observableArray and all observables in each item
				localStorage.setItem('tobuys-durandal', ko.toJSON(self.tobuys()));
			}).extend({
				// save at most twice per second
				throttle: 500
			});

		};

		app.on('tobuyitem', function (item) {
			self.tobuys.push(new Todo(item));
		});

		// map array of passed in tobuys to an observableArray of Todo objects
		self.tobuys = ko.observableArray();

		self.showMode = ko.observable('all');

		self.filteredTodos = ko.computed(function () {
			switch (self.showMode()) {
				case 'active':
					return self.tobuys().filter(function (tobuy) {
						return !tobuy.completed();
					});
				case 'completed':
					return self.tobuys().filter(function (tobuy) {
						return tobuy.completed();
					});
				default:
					return self.tobuys();
			}
		});

		self.itemBeingEdited = ko.observable(undefined);

		// remove a single tobuy
		self.remove = function (tobuy) {
			self.tobuys.remove(tobuy);
		};

		// shadow variable so that the edit can be discarded on escape
		self.editTitle = ko.observable('');
		self.cancelEdit = false;

		// remove all completed tobuys
		self.removeCompleted = function () {
			self.tobuys.remove(function (tobuy) {
				return tobuy.completed();
			});
		};

		self.isThisItemBeingEdited = function (tobuy) {
			return (tobuy === self.itemBeingEdited());
		};

		self.cancelEditing = function () {
			self.itemBeingEdited(undefined);
			self.cancelEdit = true;
		};

		// edit an item
		self.editItem = function (item) {
			self.itemBeingEdited(item);
			self.editTitle(item.title());
			self.cancelEdit = false;
		};

		// stop editing an item.  Remove the item, if it is now empty
		self.stopEditing = function (item) {
			if (!self.cancelEdit) {
				self.itemBeingEdited(undefined);

				// trim and save back
				var trimmed = self.editTitle().trim();
				item.title(trimmed);

				if (!trimmed) {
					self.remove(item);
				}
			}
		};

		// count of all completed tobuys
		self.completedCount = ko.computed(function () {
			return ko.utils.arrayFilter(self.tobuys(), function (tobuy) {
				return tobuy.completed();
			}).length;
		});

		// count of tobuys that are not complete
		self.remainingCount = ko.computed(function () {
			return self.tobuys().length - self.completedCount();
		});

		// writeable computed observable to handle marking all complete/incomplete
		self.allCompleted = ko.computed({
			// always return true/false based on the done flag of all tobuys
			read: function () {
				return !self.remainingCount();
			},

			// set all tobuys to the written value (true/false)
			write: function (newValue) {
				ko.utils.arrayForEach(self.tobuys(), function (tobuy) {
					// set even if value is the same, as subscribers are not notified in
					// that case
					tobuy.completed(newValue);
				});
			}
		});

		// helper function to keep expressions out of markup
		self.getLabel = function (count) {
			return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
		};
	};

	return ViewModel;
});
