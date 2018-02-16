/**
* Viewport shell for the TodoDeftJS application.
*/
Ext.define('TodoDeftJS.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: ['TodoDeftJS.view.TodoView'],

	initComponent: function () {
		Ext.applyIf(this, {
			items: [
				{
					id: 'tobuyView'
				}, {
					xtype: 'tobuyDeftJS-view-tobuyView'
				}
			]
		});

		return this.callParent(arguments);
	}

});