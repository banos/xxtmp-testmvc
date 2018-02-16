/*global jQuery, sap, tobuy, $ */
/*jshint unused:false */

/*
 * Does all UI-related things like creating controls, data binding configuration,
 * setting up callbacks, etc. Does not perform any business logic.
 */
(function () {
	'use strict';

	jQuery.sap.require('tobuy.SmartTextField');
	jQuery.sap.require('tobuy.formatters');

	sap.ui.jsview('tobuy.Todo', {

		getControllerName: function () {
			return 'tobuy.Todo';
		},

		controls: [],

		repeater: false,

		createContent: function (oController) {
			var toggleAll, newTodo, tobuysRepeater, completedDataTemplate, tobuyTemplate, tobuyCount,
				tobuysSelection, clearCompleted, tobuysFooter;

			// Toggle button to mark all tobuys as completed / open
			toggleAll = new sap.ui.commons.CheckBox({
				id: 'toggle-all',
				checked: {
					path: '/tobuys/',
					formatter: tobuy.formatters.allCompletedTodosFormatter
				},
				visible: {
					path: '/tobuys/',
					formatter: tobuy.formatters.isArrayNonEmptyFormatter
				}
			}).attachChange(function () {
				oController.toggleAll();
			});
			this.controls.push(toggleAll);

			// Text field for entering a new tobuy
			newTodo = new tobuy.SmartTextField('new-tobuy', {
				placeholder: 'What needs to be done?',
				autofocus: true
			}).attachChange(function () {
				oController.createTodo(this.getProperty('value'));
				this.setValue('');
			}).addStyleClass('create-tobuy');

			this.controls.push(newTodo);

			// Row repeater that will hold our tobuys
			tobuysRepeater = new sap.ui.commons.RowRepeater('tobuy-list', {
				design: sap.ui.commons.RowRepeaterDesign.Transparent,
				numberOfRows: 100
			});
			this.repeater = tobuysRepeater;

			// Completed flag that is later bound to the done status of a tobuy
			// We attach this to each text field and write it to the DOM as a data-*
			// attribute; this way, we can refer to it in our stylesheet
			completedDataTemplate = new sap.ui.core.CustomData({
				key: 'completed',
				value: {
					path: 'done',
					formatter: tobuy.formatters.booleanToStringFormatter
				},
				writeToDom: true
			});

			// A template used by the row repeater to render a tobuy
			tobuyTemplate = new sap.ui.commons.layout.HorizontalLayout({
				content: [new sap.ui.commons.CheckBox({
					checked: '{done}'
				}).attachChange(function () {
					oController.tobuyToggled(this.getBindingContext());
				}), new tobuy.SmartTextField({
					value: '{text}',
					strongediting: true
				}).attachBrowserEvent('dblclick', function (e) {
					$('.destroy').css('display', 'none');
				}).attachChange(function () {
					oController.tobuyRenamed(this.getBindingContext());
				}).addStyleClass('tobuy').addCustomData(completedDataTemplate),
				new sap.ui.commons.Button({
					lite: true,
					text: ''
				}).addStyleClass('destroy').attachPress(function () {
					oController.clearTodo(this.getBindingContext());
				})]
			});

			// Helper function to rebind the aggregation with different filters
			tobuysRepeater.rebindAggregation = function (filters) {
				this.unbindRows();
				this.bindRows('/tobuys/', tobuyTemplate, null, filters);
			};

			// Initially, we don't filter any tobuys
			tobuysRepeater.rebindAggregation([]);

			this.controls.push(tobuysRepeater);

			// Counts open tobuys
			tobuyCount = new sap.ui.commons.TextView('tobuy-count', {
				text: {
					path: '/tobuys/',
					formatter: tobuy.formatters.openTodoCountFormatter
				}
			});

			// Allows selecting what tobuys to show
			tobuysSelection = new sap.ui.commons.SegmentedButton('filters', {

				id: 'TodosSelection',
				buttons: [new sap.ui.commons.Button({
					id: 'AllTodos',
					lite: true,
					text: 'All'
				}), new sap.ui.commons.Button({
					id: 'ActiveTodos',
					lite: true,
					text: 'Active'
				}), new sap.ui.commons.Button({
					id: 'CompletedTodos',
					lite: true,
					text: 'Completed'
				})]
			}).attachSelect(function (e) {
				oController.tobuysSelected(e.getParameters().selectedButtonId);
			});
			tobuysSelection.setSelectedButton('AllTodos');

			// Button to clear all completed tobuys
			clearCompleted = new sap.ui.commons.Button({
				id: 'clear-completed',
				lite: true,
				text: 'Clear Completed',
				visible: {
					path: '/tobuys/',
					formatter: tobuy.formatters.hasCompletedTodosFormatter
				}
			}).attachPress(function () {
				oController.clearCompletedTodos();
			});

			tobuysFooter = new sap.ui.commons.layout.HorizontalLayout('footer', {
				content: [tobuyCount, tobuysSelection, clearCompleted],
				visible: {
					path: '/tobuys/',
					formatter: tobuy.formatters.isArrayNonEmptyFormatter
				}
			});

			this.controls.push(tobuysFooter);

			return this.controls;
		},

		changeSelection: function (filters) {
			this.repeater.rebindAggregation(filters);
		}

	});
})();
