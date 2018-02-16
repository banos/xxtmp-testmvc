/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.tobuys = Utils.store(key);
		this.onChanges = [];
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		Utils.store(this.key, this.tobuys);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addTodo = function (title) {
		this.tobuys = this.tobuys.concat({
			id: Utils.uuid(),
			title: title,
			completed: false
		});

		this.inform();
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// tobuy items themselves.
		this.tobuys = this.tobuys.map(function (tobuy) {
			return Utils.extend({}, tobuy, {completed: checked});
		});

		this.inform();
	};

	app.TodoModel.prototype.toggle = function (tobuyToToggle) {
		this.tobuys = this.tobuys.map(function (tobuy) {
			return tobuy !== tobuyToToggle ?
				tobuy :
				Utils.extend({}, tobuy, {completed: !tobuy.completed});
		});

		this.inform();
	};

	app.TodoModel.prototype.destroy = function (tobuy) {
		this.tobuys = this.tobuys.filter(function (candidate) {
			return candidate !== tobuy;
		});

		this.inform();
	};

	app.TodoModel.prototype.save = function (tobuyToSave, text) {
		this.tobuys = this.tobuys.map(function (tobuy) {
			return tobuy !== tobuyToSave ? tobuy : Utils.extend({}, tobuy, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.tobuys = this.tobuys.filter(function (tobuy) {
			return !tobuy.completed;
		});

		this.inform();
	};

})();
