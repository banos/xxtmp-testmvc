/**
* To-Do data view.
*/
Ext.define('TodoDeftJS.view.TodoView', {
	extend: 'Ext.view.View',
	alias: 'widget.tobuyDeftJS-view-tobuyView',
	controller: 'TodoDeftJS.controller.TodoController',
	inject: ['templateLoader', 'tobuyStore'],

	config: {
		templateLoader: null,
		tobuyStore: null
	},

	initComponent: function () {
		Ext.apply(this, {
			itemSelector: 'li.tobuy',
			store: this.getTodoStore(),
			tpl: '',
			loader: {
				url: 'templates/tobuylist.tpl',
				autoLoad: true,
				renderer: this.getTemplateLoader().templateRenderer
			},
			templateConfig: {
				controller: this.getController()
			}
		});

		return this.callParent(arguments);
	}

});