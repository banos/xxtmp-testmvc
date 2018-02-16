/**
* Viewport shell for the TobuyDeftJS application.
*/
Ext.define('TobuyDeftJS.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: ['TobuyDeftJS.view.TobuyView'],

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