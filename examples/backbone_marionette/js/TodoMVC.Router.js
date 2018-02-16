/*global TodoMVC:true, Backbone, $ */

var TodoMVC = TodoMVC || {};

(function () {
	'use strict';

	var filterChannel = Backbone.Radio.channel('filter');

	// TodoList Router
	// ---------------
	//
	// Handles a single dynamic route to show
	// the active vs complete tobuy items
	TodoMVC.Router = Mn.AppRouter.extend({
		appRoutes: {
			'*filter': 'filterItems'
		}
	});

	// TodoList Controller (Mediator)
	// ------------------------------
	//
	// Control the workflow and logic that exists at the application
	// level, above the implementation detail of views and models
	TodoMVC.Controller = Mn.Object.extend({

		initialize: function () {
			this.tobuyList = new TodoMVC.TodoList();
		},

		// Start the app by showing the appropriate views
		// and fetching the list of tobuy items, if there are any
		start: function () {
			this.showHeader(this.tobuyList);
			this.showFooter(this.tobuyList);
			this.showTodoList(this.tobuyList);
			this.tobuyList.on('all', this.updateHiddenElements, this);
			this.tobuyList.fetch();
		},

		updateHiddenElements: function () {
			$('#main, #footer').toggle(!!this.tobuyList.length);
		},

		showHeader: function (tobuyList) {
			var header = new TodoMVC.HeaderLayout({
				collection: tobuyList
			});
			TodoMVC.App.root.showChildView('header', header);
		},

		showFooter: function (tobuyList) {
			var footer = new TodoMVC.FooterLayout({
				collection: tobuyList
			});
			TodoMVC.App.root.showChildView('footer', footer);
		},

		showTodoList: function (tobuyList) {
			TodoMVC.App.root.showChildView('main', new TodoMVC.ListView({
				collection: tobuyList
			}));
		},

		// Set the filter to show complete or all items
		filterItems: function (filter) {
			var newFilter = filter && filter.trim() || 'all';
			filterChannel.request('filterState').set('filter', newFilter);
		}
	});
})();
