define([
	'js/core/Application',
	'app/model/Todo',
	'app/collection/TodoList',
	'js/data/FilterDataView',
	'js/data/LocalStorageDataSource'
], function (Application, Todo, TodoList, FilterDataView, DataSource) {
	var ENTER_KEY = 13;

	return Application.inherit('app.TodoClass', {
		/**
		 * Initializes the app
		 * In this method we set the initial models
		 */
		initialize: function () {
			this.set('tobuyList', null);
			this.set('filterList', null);
			this.callBase();
		},

		/**
		 * Are triggered
		 */
		showAll: function () {
			this.$.filterList.set('filter', 'all');
		},

		showActive: function () {
			this.$.filterList.set('filter', 'active');
		},

		showCompleted: function () {
			this.$.filterList.set('filter', 'completed');
		},

		/**
		 * The rest is just controller stuff
		 */
		addNewTodo: function (e) {
			if (e.domEvent.keyCode === ENTER_KEY) {
				var title = e.target.get('value').trim();
				var newTodo;

				if (title) {
					newTodo = this.$.dataSource.createEntity(Todo);

					newTodo.set({
						title: title,
						completed: false
					});

					this.get('tobuyList').add(newTodo);

					// save the new item
					newTodo.save();
					e.target.set('value', '');
				}
			}
		},

		markAllComplete: function (e) {
			this.get('tobuyList').markAll(e.target.$el.checked);
		},

		clearCompleted: function () {
			this.get('tobuyList').clearCompleted();
		},

		removeTodo: function (e) {
			var tobuy = e.$;

			tobuy.remove(null, function (err) {
				if (!err) {
					this.get('tobuyList').remove(tobuy);
				}
			}.bind(this));
		},

		/**
		 * Start the application and render it to the body ...
		 */
		start: function (parameter, callback) {
			this.set('tobuyList', this.$.dataSource.createCollection(TodoList));

			// fetch all tobuys, can be done sync because we use localStorage
			this.$.tobuyList.fetch();

			this.set('filterList', new FilterDataView({
				baseList: this.get('tobuyList'),
				filter: 'all',
				filterFnc: function (item) {
					var filter = this.$.filter;

					if (filter === 'active') {
						return !item.isCompleted();
					} else if (filter === 'completed') {
						return item.isCompleted();
					} else {
						return true;
					}
				}})
			);
			// false - disables autostart
			this.callBase();
		},

		translateItems: function (num) {
			return num === 1 ? 'item' : 'items';
		},

		selectedClass: function (expected, current) {
			return expected === current ? 'selected' : '';
		}
	});
});
