'use strict';

/**
* DeftJS Application class for the TobuyDeftJS application.
*/
Ext.define('TobuyDeftJS.Application', {
	extend: 'Deft.mvc.Application',
	requires: ['TobuyDeftJS.util.TemplateLoader', 'TobuyDeftJS.store.TobuyStore', 'TobuyDeftJS.view.Viewport'],

	/**
	* init() runs when Ext.onReady() is called.
	*/
	init: function () {
		this.beforeInit();
		Deft.Injector.configure(this.buildInjectorConfiguration());
		return this.afterInit();
	},

	/**
	* @protected
	* Returns the configuration object to pass to Deft.Injector.configure(). Override in subclasses to alter the Injector configuration before returning the config object.
	* @return {Object} The Injector configuration object.
	*/
	buildInjectorConfiguration: function () {
		var config;
		config = {
			templateLoader: 'TobuyDeftJS.util.TemplateLoader',
			tobuyStore: 'TobuyDeftJS.store.TobuyStore'
		};
		return config;
	},

	/**
	* @protected
	* Runs at the start of the init() method. Override in subclasses if needed.
	*/
	beforeInit: function () {},

	/**
	* @protected
	* Runs at the end of the init() method. Useful to create initial Viewport, start Jasmine tests, etc.
	*/
	afterInit: function () {
		Ext.tip.QuickTipManager.init();
		return Ext.create('TobuyDeftJS.view.Viewport');
	}

});