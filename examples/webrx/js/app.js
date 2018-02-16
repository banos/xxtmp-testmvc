/*global wx, Rx */
(function () {
	'use strict';

	var localStorageKey = 'tobuys-webrx';
	var displayModeAll = 'all';
	var displayModeActive = 'active';
	var displayModeCompleted = 'completed';

	// represent a single tobuy item
	function Todo(title, completed) {
		this.title = wx.property(title);
		this.completed = wx.property(completed);
		this.editing = wx.property(false);
	}

	// our main view model
	var ViewModel = function (tobuys) {
		// map array of passed in tobuys to an observableArray of Todo objects
		this.tobuys = wx.list(tobuys.map(function (tobuy) {
			return new Todo(tobuy.title, tobuy.completed);
		}));

		// we want to get notified of changes to any of the tobuys contained in the list
		// not just of structural changes to the list (via "listChanged" obserable).
		// Those changes are then exposed using the list's "itemChanged" obseravable
		this.tobuys.changeTrackingEnabled = true;

		this.current = wx.property();
		this.showMode = wx.property('all');

		// create a live-filtered projection of the tobuys collection that will update
		// when its source (this.tobuys) or any of its items changes or when when "showMode" changes
		this.filteredTodos = this.tobuys.project(function (tobuy) {
			switch (this.showMode()) {
				case displayModeActive:
					return !tobuy.completed();
				case displayModeCompleted:
					return tobuy.completed();
				default:
					return true;
			}
		}.bind(this), this.showMode.changed);

		// add a new entry, when enter key is pressed
		this.addCmd = wx.command(function () {
			var current = this.current().trim();

			if (current) {
				this.tobuys.push(new Todo(current));
				this.current('');
			}
		}, this);

		// remove a single entry
		this.removeCmd = wx.command(function (tobuy) {
			this.tobuys.remove(tobuy);
		}, this);

		// mark all tobuys complete/incomplete
		this.completeAllCmd = wx.command(function () {
			this.tobuys.forEach(function (tobuy) {
				tobuy.completed(this.remainingCount());
			}, this);
		}, this);

		// remove all completed entries
		this.removeCompletedCmd = wx.command(function () {
			this.tobuys.filter(function (tobuy) {
				return tobuy.completed();
			}).forEach(function (item) {
				this.tobuys.remove(item);
			}, this);
		}, this);

		// edit an item
		this.editItemCmd = wx.command(function (item) {
			item.editing(true);
			item.previousTitle = item.title();
		}, this);

		// cancel editing an item and revert to the previous content
		this.cancelEditingCmd = wx.command(function (item) {
			item.editing(false);
			item.title(item.previousTitle);
		}, this);

		// stop editing an item, remove the item, if it is now empty
		this.saveEditingCmd = wx.command(function (item) {
			item.editing(false);
			var title = item.title();
			var trimmedTitle = title.trim();

			if (title !== trimmedTitle) {
				item.title(trimmedTitle);
			}

			if (!trimmedTitle) {
				this.tobuys.remove(item);
			}
		}, this);

		this.countCompleted = function () {
			return this.tobuys.filter(function (tobuy) {
				return tobuy.completed();
			}).length;
		};

		// create an observable output-property representing all completed tobuys
		this.completedCount = Rx.Observable.merge(this.tobuys.listChanged, this.tobuys.itemChanged)
			.select(this.countCompleted, this)
			.toProperty(this.countCompleted());

		this.countRemaining = function () {
			return this.tobuys.length() - this.completedCount();
		};

		// create an observable output-property representing all tobuys that are not complete
		this.remainingCount = Rx.Observable.merge(this.tobuys.listChanged, this.tobuys.itemChanged)
			.select(this.countRemaining, this)
			.toProperty(this.countRemaining());

		// setup routing
		var self = this;

		wx.router.state({
			name: '$',
			url: '/examples/webrx/',
			onEnter: function () {
				self.showMode(displayModeAll);
			}
		}).state({
			name: 'active',
			onEnter: function () {
				self.showMode(displayModeActive);
			}
		}).state({
			name: 'completed',
			onEnter: function () {
				self.showMode(displayModeCompleted);
			}
		});

		// reload root state ($)
		wx.router.reload();

		// persistence
		Rx.Observable.merge(this.tobuys.listChanged, this.tobuys.itemChanged)
			.throttle(500)
			.subscribeOnNext(function () {
				localStorage.setItem(localStorageKey, JSON.stringify(this.tobuys.map(function (x) {
					return { title: x.title(), completed: x.completed() };
				})));
			}, this);
	};

	// check local storage for tobuys
	var tobuys = JSON.parse(localStorage.getItem(localStorageKey));

	// bind a new instance of our view model to the page
	var viewModel = new ViewModel(tobuys || []);
	wx.applyBindings(viewModel);
}());
