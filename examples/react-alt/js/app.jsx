/*jshint quotmark:false */
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
	var TobuyActions = app.tobuyActions;
	var TobuyStore = app.tobuyStore;

	var ENTER_KEY = 13;

	var TobuyApp = React.createClass({
		getInitialState: function () {
			return TobuyStore.getState();
		},

		componentDidMount: function () {
			TobuyStore.listen(this.onStoreChange);

			var router = Router({
				'/': function () {
					TobuyActions.show(app.ALL_TOBUYS);
				},
				'/active': function () {
					TobuyActions.show(app.ACTIVE_TOBUYS);
				},
				'/completed': function () {
					TobuyActions.show(app.COMPLETED_TOBUYS);
				}
			});

			router.init('/');
		},

		componentDidUnmount: function () {
			TobuyStore.unlisten(this.onStoreChange);
		},

		handleChange: function (event) {
			this.setState({newTobuy: event.target.value});
		},

		onStoreChange: function (state) {
			this.setState(state);
		},

		handleNewTobuyKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTobuy.trim();

			if (val) {
				this.setState({newTobuy: ''});

				TobuyActions.addTobuy(val);
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			TobuyActions.toggleAll(checked);
		},

		toggle: function (tobuyToToggle) {
			TobuyActions.toggle(tobuyToToggle);
		},

		destroy: function (tobuy) {
			TobuyActions.destroy(tobuy);
		},

		edit: function (tobuy) {
			TobuyActions.edit(tobuy.id);
		},

		save: function (tobuyToSave, text) {
			TobuyActions.save({
				tobuyToSave: tobuyToSave,
				text: text
			});

			TobuyActions.edit(null);
		},

		cancel: function () {
			TobuyActions.edit(null);
		},

		clearCompleted: function () {
			TobuyActions.clearCompleted();
		},

		render: function () {
			var footer = null;
			var main = null;
			var tobuys = this.state.tobuys;

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
							ref="newField"
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

	React.render(
		<TobuyApp/>,
		document.getElementsByClassName('tobuyapp')[0]
	);
})();
