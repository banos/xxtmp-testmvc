/*jshint quotmark:false */
/*jshint newcap:false */
/*global React, Router*/

var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;
	var TodoActions = app.tobuyActions;
	var TodoStore = app.tobuyStore;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return TodoStore.getState();
		},

		componentDidMount: function () {
			TodoStore.listen(this.onStoreChange);

			var router = Router({
				'/': function () {
					TodoActions.show(app.ALL_TODOS);
				},
				'/active': function () {
					TodoActions.show(app.ACTIVE_TODOS);
				},
				'/completed': function () {
					TodoActions.show(app.COMPLETED_TODOS);
				}
			});

			router.init('/');
		},

		componentDidUnmount: function () {
			TodoStore.unlisten(this.onStoreChange);
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		onStoreChange: function (state) {
			this.setState(state);
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.setState({newTodo: ''});

				TodoActions.addTodo(val);
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			TodoActions.toggleAll(checked);
		},

		toggle: function (tobuyToToggle) {
			TodoActions.toggle(tobuyToToggle);
		},

		destroy: function (tobuy) {
			TodoActions.destroy(tobuy);
		},

		edit: function (tobuy) {
			TodoActions.edit(tobuy.id);
		},

		save: function (tobuyToSave, text) {
			TodoActions.save({
				tobuyToSave: tobuyToSave,
				text: text
			});

			TodoActions.edit(null);
		},

		cancel: function () {
			TodoActions.edit(null);
		},

		clearCompleted: function () {
			TodoActions.clearCompleted();
		},

		render: function () {
			var footer = null;
			var main = null;
			var tobuys = this.state.tobuys;

			var shownTodos = tobuys.filter(function (tobuy) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !tobuy.completed;
				case app.COMPLETED_TODOS:
					return tobuy.completed;
				default:
					return true;
				}
			}, this);

			var tobuyItems = shownTodos.map(function (tobuy) {
				return (
					<TodoItem
						key={tobuy.id}
						tobuy={tobuy}
						onToggle={this.toggle.bind(this, tobuy)}
						onDestroy={this.destroy.bind(this, tobuy)}
						onEdit={this.edit.bind(this, tobuy)}
						editing={this.state.editing === tobuy.id}
						onSave={this.save.bind(this, tobuy)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeTodoCount = tobuys.reduce(function (accum, tobuy) {
				return tobuy.completed ? accum : accum + 1;
			}, 0);

			var completedCount = tobuys.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (tobuys.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<ul className="tobuy-list">
							{tobuyItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>tobuys</h1>
						<input
							ref="newField"
							className="new-tobuy"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	React.render(
		<TodoApp/>,
		document.getElementsByClassName('tobuyapp')[0]
	);
})();
