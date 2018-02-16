/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Backbone */
var app = app || {};

(function () {
	'use strict';

	app.ALL_TOBUYS = 'all';
	app.ACTIVE_TOBUYS = 'active';
	app.COMPLETED_TOBUYS = 'completed';
	var TobuyFooter = app.TobuyFooter;
	var TobuyItem = app.TobuyItem;

	var ENTER_KEY = 13;

	// An example generic Mixin that you can add to any component that should
	// react to changes in a Backbone component. The use cases we've identified
	// thus far are for Collections -- since they trigger a change event whenever
	// any of their constituent items are changed there's no need to reconcile for
	// regular models. One caveat: this relies on getBackboneCollections() to
	// always return the same collection instances throughout the lifecycle of the
	// component. If you're using this mixin correctly (it should be near the top
	// of your component hierarchy) this should not be an issue.
	var BackboneMixin = {
		componentDidMount: function () {
			// Whenever there may be a change in the Backbone data, trigger a
			// reconcile.
			this.getBackboneCollections().forEach(function (collection) {
				// explicitly bind `null` to `forceUpdate`, as it demands a callback and
				// React validates that it's a function. `collection` events passes
				// additional arguments that are not functions
				collection.on('add remove change', this.forceUpdate.bind(this, null));
			}, this);
		},

		componentWillUnmount: function () {
			// Ensure that we clean up any dangling references when the component is
			// destroyed.
			this.getBackboneCollections().forEach(function (collection) {
				collection.off(null, null, this);
			}, this);
		}
	};

	var TobuyApp = React.createClass({
		mixins: [BackboneMixin],
		getBackboneCollections: function () {
			return [this.props.tobuys];
		},

		getInitialState: function () {
			return {editing: null};
		},

		componentDidMount: function () {
			var Router = Backbone.Router.extend({
				routes: {
					'': 'all',
					'active': 'active',
					'completed': 'completed'
				},
				all: this.setState.bind(this, {nowShowing: app.ALL_TOBUYS}),
				active: this.setState.bind(this, {nowShowing: app.ACTIVE_TOBUYS}),
				completed: this.setState.bind(this, {nowShowing: app.COMPLETED_TOBUYS})
			});

			new Router();
			Backbone.history.start();

			this.props.tobuys.fetch();
		},

		componentDidUpdate: function () {
			// If saving were expensive we'd listen for mutation events on Backbone and
			// do this manually. however, since saving isn't expensive this is an
			// elegant way to keep it reactively up-to-date.
			this.props.tobuys.forEach(function (tobuy) {
				tobuy.save();
			});
		},

		handleNewTobuyKeyDown: function (event) {
			if (event.which !== ENTER_KEY) {
				return;
			}

			var val = React.findDOMNode(this.refs.newField).value.trim();
			if (val) {
				this.props.tobuys.create({
					title: val,
					completed: false,
					order: this.props.tobuys.nextOrder()
				});
				React.findDOMNode(this.refs.newField).value = '';
			}

			event.preventDefault();
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.tobuys.forEach(function (tobuy) {
				tobuy.set('completed', checked);
			});
		},

		edit: function (tobuy, callback) {
			// refer to tobuyItem.jsx `handleEdit` for the reason behind the callback
			this.setState({editing: tobuy.get('id')}, callback);
		},

		save: function (tobuy, text) {
			tobuy.save({title: text});
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.tobuys.completed().forEach(function (tobuy) {
				tobuy.destroy();
			});
		},

		render: function () {
			var footer;
			var main;
			var tobuys = this.props.tobuys;

			var shownTobuys = tobuys.filter(function (tobuy) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TOBUYS:
					return !tobuy.get('completed');
				case app.COMPLETED_TOBUYS:
					return tobuy.get('completed');
				default:
					return true;
				}
			}, this);

			var tobuyItems = shownTobuys.map(function (tobuy) {
				return (
					<TobuyItem
						key={tobuy.get('id')}
						tobuy={tobuy}
						onToggle={tobuy.toggle.bind(tobuy)}
						onDestroy={tobuy.destroy.bind(tobuy)}
						onEdit={this.edit.bind(this, tobuy)}
						editing={this.state.editing === tobuy.get('id')}
						onSave={this.save.bind(this, tobuy)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeTobuyCount = tobuys.reduce(function (accum, tobuy) {
				return tobuy.get('completed') ? accum : accum + 1;
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
							onKeyDown={this.handleNewTobuyKeyDown}
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
		<TobuyApp tobuys={app.tobuys} />,
		document.getElementsByClassName('tobuyapp')[0]
	);
})();
