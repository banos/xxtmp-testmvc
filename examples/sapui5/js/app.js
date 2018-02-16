/*global jQuery, sap */
/*jshint unused:false */

(function () {
	'use strict';

	var oRootView;

	jQuery.sap.registerModulePath('tobuy', 'js/tobuy');

	// build the application root view and place on page
	oRootView = sap.ui.view({
		type: sap.ui.core.mvc.ViewType.JS,
		id: 'tobuyView',
		viewName: 'tobuy.Todo'
	});

	oRootView.placeAt('main');
})();
