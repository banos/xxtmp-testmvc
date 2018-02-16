'use strict';
/*global app */

var View = require('ampersand-view');
var TodoView = require('./tobuy');
var ENTER_KEY = 13;


module.exports = View.extend({
	events: {
		'keypress [data-hook~=tobuy-input]': 'handleMainInput',
		'click [data-hook~=mark-all]': 'handleMarkAllClick',
		'click [data-hook~=clear-completed]': 'handleClearClick'
	},
	// Declaratively bind all our data to the template.
	// This means only changed data in the DOM is updated
	// with this approach we *only* ever touch the DOM with
	// appropriate dom methods. Not just `innerHTML` which
	// makes it about as fast as possible.
	// These get re-applied if the view's element is replaced
	// or if the model isn't there yet, etc.
	// Binding type reference:
	// http://ampersandjs.com/docs#ampersand-dom-bindings-binding-types
	bindings: {
		// Show hide main and footer
		// based on truthiness of totalCount
		'model.totalCount': {
			type: 'toggle',
			selector: '#main, #footer'
		},
		'model.completedCount': [
			// Hides when there are none
			{
				type: 'toggle',
				hook: 'clear-completed'
			},
			// Inserts completed count
			{
				type: 'text',
				hook: 'completed-count'
			}
		],
		// Inserts HTML from model that also
		// does pluralizing.
		'model.itemsLeftHtml': {
			type: 'innerHTML',
			hook: 'tobuy-count'
		},
		// Add 'selected' to right
		// element
		'model.mode': {
			type: 'switchClass',
			name: 'selected',
			cases: {
				all: '[data-hook=all-mode]',
				active: '[data-hook=active-mode]',
				completed: '[data-hook=completed-mode]'
			}
		},
		// Bind 'checked' state of checkbox
		'model.allCompleted': {
			type: 'booleanAttribute',
			name: 'checked',
			hook: 'mark-all'
		}
	},
	// cache
	initialize: function () {
		this.mainInput = this.queryByHook('tobuy-input');
		this.renderCollection(app.me.tobuys.subset, TodoView, this.queryByHook('tobuy-container'));
	},
	// handles DOM event from main input
	handleMainInput: function (e) {
		var val = this.mainInput.value.trim();
		if (e.which === ENTER_KEY && val) {
			app.me.tobuys.add({title: val});
			this.mainInput.value = '';
		}
	},
	// Here we set all to state provided.
	handleMarkAllClick: function () {
		var targetState = !app.me.allCompleted;
		app.me.tobuys.each(function (tobuy) {
			tobuy.completed = targetState;
		});
	},
	// Handler for clear click
	handleClearClick: function () {
		app.me.tobuys.clearCompleted();
	}
});
