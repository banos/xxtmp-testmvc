/**
* Controls the main (root) UI container for the application.
*/
Ext.define('TodoDeftJS.controller.TodoController', {
	extend: 'Deft.mvc.ViewController',
	inject: ['tobuyStore'],

	config: {
		tobuyStore: null,
		currentTodo: null
	},

	control: {
		view: {
			beforecontainerkeydown: 'onNewTodoKeyDown',
			beforecontainerclick: 'onTodoToolsClick',
			beforeitemclick: 'onTodoClick',
			beforeitemdblclick: 'onTodoEditClick',
			beforeitemkeydown: 'onEditTodoKeyDown'
		}
	},

	init: function () {
		this.callParent(arguments);
		return this;
	},

	addTodo: function (title) {
		var newTodo;
		title = title.trim();

		if(title.length) {
			newTodo = Ext.create('TodoDeftJS.model.Todo', {
				title: Ext.util.Format.htmlEncode(title),
				completed: false
			});

			this.getTodoStore().add(newTodo);
		}

		Ext.dom.Query.selectNode('#new-tobuy').focus();
	},

	toggleCompleted: function (tobuy) {
		tobuy.set('completed', !tobuy.get('completed'));
	},

	deleteTodo: function (tobuy) {
		this.getTodoStore().remove(tobuy);
	},

	updateTodo: function (tobuy, title) {
		this.setCurrentTodo(null);

		if ((tobuy === null) || (tobuy === undefined)) {
			return;
		}

		tobuy.set('editing', false);
		title = title.trim();

		if (((title != null) && (title != undefined) && title.length)) {
			tobuy.set('title', Ext.util.Format.htmlEncode(title));
		} else {
			this.deleteTodo(tobuy);
		}

		Ext.dom.Query.selectNode('#new-tobuy').focus();
	},

	completedCount: function () {
		return this.getTodoStore().completedCount();
	},

	incompleteCount: function () {
		return this.getTodoStore().incompleteCount();
	},

	areAllComplete: function () {
		return this.getTodoStore().completedCount() === this.getTodoStore().count();
	},

	onNewTodoKeyDown: function (view, event) {
		var title;
		if (event.target.id === 'new-tobuy' && event.keyCode === Ext.EventObject.ENTER) {
			title = event.target.value.trim();
			this.addTodo(title);
			event.target.value = null;
			return false;
		}
		return true;
	},

	onTodoEditClick: function (view, tobuy, item, idx, event) {
		var editField;
		this.setCurrentTodo(tobuy);
		tobuy.set('editing', true);
		editField = Ext.dom.Query.selectNode('#tobuy-list li.editing .edit');
		editField.focus();
		// Ensure that focus() doesn't select all the text as well by resetting the value.
		editField.value = editField.value;
		Ext.fly(editField).on('blur', this.onTodoBlur, this);
		return false;
	},

	onTodoBlur: function (event, target) {
		Ext.fly(event.target).un('blur', this.onTodoBlur, this);
		if ((target != null) && (target != undefined)) {
			return this.updateTodo(this.getCurrentTodo(), target.value.trim());
		}
	},

	onEditTodoKeyDown: function (view, tobuy, item, idx, event) {
		var title;

		if (event.keyCode === Ext.EventObject.ENTER) {
			if (event.target.id === 'new-tobuy') {
				this.onNewTodoKeyDown(view, event);
				return false;
			}

			title = event.target.value.trim();
			Ext.fly(event.target).un('blur', this.onTodoBlur, this);
			this.updateTodo(tobuy, title);
			return false;
		}

		return true;
	},

	onTodoClick: function (view, tobuy, item, idx, event) {
		if (Ext.fly(event.target).hasCls('toggle')) {
			this.toggleCompleted(tobuy);
		} else if (Ext.fly(event.target).hasCls('destroy')) {
			this.deleteTodo(tobuy);
		}
		return true;
	},

	onTodoToolsClick: function (view, event) {
		if (Ext.fly(event.target).hasCls('toggleall')) {
			this.getTodoStore().toggleAllCompleted(event.target.checked);
		} else if (Ext.fly(event.target).hasCls('clearcompleted')) {
			this.getTodoStore().deleteCompleted();
		}
		return true;
	}

});