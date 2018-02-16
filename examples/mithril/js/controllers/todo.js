'use strict';
/*global m */

var app = app || {};
app.controller = function () {

	// Todo collection
	this.list = app.storage.get();

	// Update with props
	this.list = this.list.map(function (item) {
		return new app.Todo(item);
	});

	// Temp title placeholder
	this.title = m.prop('');

	// Todo list filter
	this.filter = m.prop(m.route.param('filter') || '');

	this.add = function () {
		var title = this.title().trim();
		if (title) {
			this.list.push(new app.Todo({title: title}));
			app.storage.put(this.list);
		}
		this.title('');
	};

	this.isVisible = function (tobuy) {
		switch (this.filter()) {
			case 'active':
				return !tobuy.completed();
			case 'completed':
				return tobuy.completed();
			default:
				return true;
		}
	};

	this.complete = function (tobuy) {
		if (tobuy.completed()) {
			tobuy.completed(false);
		} else {
			tobuy.completed(true);
		}
		app.storage.put(this.list);
	};

	this.edit = function (tobuy) {
		tobuy.previousTitle = tobuy.title();
		tobuy.editing(true);
	};

	this.doneEditing = function (tobuy, index) {
		if (!tobuy.editing()) {
			return;
		}

		tobuy.editing(false);
		tobuy.title(tobuy.title().trim());
		if (!tobuy.title()) {
			this.list.splice(index, 1);
		}
		app.storage.put(this.list);
	};

	this.cancelEditing = function (tobuy) {
		tobuy.title(tobuy.previousTitle);
		tobuy.editing(false);
	};

	this.clearTitle = function () {
		this.title('');
	};

	this.remove = function (key) {
		this.list.splice(key, 1);
		app.storage.put(this.list);
	};

	this.clearCompleted = function () {
		for (var i = this.list.length - 1; i >= 0; i--) {
			if (this.list[i].completed()) {
				this.list.splice(i, 1);
			}
		}
		app.storage.put(this.list);
	};

	this.amountCompleted = function () {
		var amount = 0;
		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].completed()) {
				amount++;
			}
		}
		return amount;
	};

	this.allCompleted = function () {
		for (var i = 0; i < this.list.length; i++) {
			if (!this.list[i].completed()) {
				return false;
			}
		}
		return true;
	};

	this.completeAll = function () {
		var allCompleted = this.allCompleted();
		for (var i = 0; i < this.list.length; i++) {
			this.list[i].completed(!allCompleted);
		}
		app.storage.put(this.list);
	};
};
