Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'TobuyDeftJS': 'js'
	}
});

Ext.syncRequire(['Ext.Component', 'Ext.ComponentManager', 'Ext.ComponentQuery']);