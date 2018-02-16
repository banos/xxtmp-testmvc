/*jshint quotmark:false */
/*jshint newcap:false */

var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;

	app.tobuyActions = app.alt.generateActions(
		'toggleAll',
		'toggle',
		'destroy',
		'save',
		'clearCompleted',
		'edit',
		'show'
	);

	app.tobuyActions = Utils.extend(
		app.tobuyActions,
		app.alt.createActions({
			addTodo: function (title) {
				return {
					id: Utils.uuid(),
					title: title,
					completed: false
				};
			}
		})
	);
})();
