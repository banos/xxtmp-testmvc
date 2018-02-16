/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
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

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.props.model.addTodo(val);
				this.setState({newTodo: ''});
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (tobuyToToggle) {
			this.props.model.toggle(tobuyToToggle);
		},

		destroy: function (tobuy) {
			this.props.model.destroy(tobuy);
		},

		edit: function (tobuy) {
			this.setState({editing: tobuy.id});
		},

		save: function (tobuyToSave, text) {
			this.props.model.save(tobuyToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		render: function () {
			var footer;
			var main;
			var tobuys = this.props.model.tobuys;

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

	var model = new app.TodoModel('react-tobuys');

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('tobuyapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
