/*jshint quotmark:false */
/*jshint newcap:false */


var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	var LOCALSTORAGE_NAMESPACE = 'react-alt-tobuy';

	var TodoStore = function () {
		this.state = {
			tobuys: Utils.store(LOCALSTORAGE_NAMESPACE + '.tobuys'),
			nowShowing: Utils.store(LOCALSTORAGE_NAMESPACE + '.nowShowing') || app.ALL_TODOS,
			editing: Utils.store(LOCALSTORAGE_NAMESPACE + '.editing') || null
		};

		this.bindListeners({
			addTodo: app.tobuyActions.addTodo,
			toggleAll: app.tobuyActions.toggleAll,
			toggle: app.tobuyActions.toggle,
			destroy: app.tobuyActions.destroy,
			save: app.tobuyActions.save,
			clearCompleted: app.tobuyActions.clearCompleted,
			edit: app.tobuyActions.edit,
			show: app.tobuyActions.show
		});
	};

	TodoStore.prototype.addTodo = function (tobuy) {
		this.setState({
			tobuys: this.state.tobuys.concat(tobuy)
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.tobuys', this.state.tobuys);
	};

	TodoStore.prototype.toggleAll = function (checked) {
		var updatedTodos = this.state.tobuys.map(function (tobuy) {
			return Utils.extend({}, tobuy, {completed: checked});
		});

		this.setState({
			tobuys: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.tobuys', this.state.tobuys);
	};

	TodoStore.prototype.toggle = function (tobuyToToggle) {
		var updatedTodos = this.state.tobuys.map(function (tobuy) {
			return tobuy !== tobuyToToggle ?
				tobuy :
				Utils.extend({}, tobuy, {completed: !tobuy.completed});
		});

		this.setState({
			tobuys: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.tobuys', this.state.tobuys);
	};

	TodoStore.prototype.destroy = function (tobuyToDestroy) {
		var updatedTodos = this.state.tobuys.filter(function (tobuy) {
			return tobuy !== tobuyToDestroy;
		});

		this.setState({
			tobuys: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.tobuys', this.state.tobuys);
	};

	TodoStore.prototype.save = function (command) {
		var updatedTodos = this.state.tobuys.map(function (tobuy) {
			return tobuy !== command.tobuyToSave ?
				tobuy :
				Utils.extend({}, command.tobuyToSave, {title: command.text});
		});

		this.setState({
			tobuys: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.tobuys', this.state.tobuys);
	};

	TodoStore.prototype.clearCompleted = function () {
		var updatedTodos = this.state.tobuys.filter(function (tobuy) {
			return !tobuy.completed;
		});

		this.setState({
			tobuys: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.tobuys', this.state.tobuys);
	};

	TodoStore.prototype.edit = function (id) {
		this.setState({
			editing: id
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.editing', this.editing);
	};

	TodoStore.prototype.show = function (nowShowing) {
		this.setState({
			nowShowing: nowShowing
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.nowShowing', this.nowShowing);
	};

	TodoStore.displayName = 'TodoStore';

	app.tobuyStore = app.alt.createStore(TodoStore);
})();
