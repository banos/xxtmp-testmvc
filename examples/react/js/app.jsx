/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_TOBUYS = 'all';
	app.ACTIVE_TOBUYS = 'active';
	app.COMPLETED_TOBUYS = 'completed';
	var TobuyFooter = app.TobuyFooter;
	var TobuyItem = app.TobuyItem;

	var ENTER_KEY = 13;

	var TobuyApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TOBUYS,
				editing: null,
				newTobuy: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TOBUYS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TOBUYS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TOBUYS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newTobuy: event.target.value});
		},

		handleNewTobuyKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTobuy.trim();

			if (val) {
				this.props.model.addTobuy(val);
				this.setState({newTobuy: ''});
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

			var shownTobuys = tobuys.filter(function (tobuy) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TOBUYS:
					return !tobuy.completed;
				case app.COMPLETED_TOBUYS:
					return tobuy.completed;
				default:
					return true;
				}
			}, this);

			var tobuyItems = shownTobuys.map(function (tobuy) {
				return (
					<TobuyItem
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

			var activeTobuyCount = tobuys.reduce(function (accum, tobuy) {
				return tobuy.completed ? accum : accum + 1;
			}, 0);

			var completedCount = tobuys.length - activeTobuyCount;

			if (activeTobuyCount || completedCount) {
				footer =
					<TobuyFooter
						count={activeTobuyCount}
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
							checked={activeTobuyCount === 0}
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
							value={this.state.newTobuy}
							onKeyDown={this.handleNewTobuyKeyDown}
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

	var model = new app.TobuyModel('react-tobuys');

	function render() {
		React.render(
			<TobuyApp model={model}/>,
			document.getElementsByClassName('tobuyapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
