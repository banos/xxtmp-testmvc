/*global require */
require.config({
	paths: {
		jquery: '../node_modules/jquery/dist/jquery',
		can: '../node_modules/canjs/amd/can',
		localstorage: '../node_modules/canjs-localstorage/can.localstorage'
	}
});

require([
	'jquery',
	'can/view',
	'can/route',
	'./components/tobuy-app'
], function ($, can, route) {
	'use strict';

	$(function () {
		// Set up a route that maps to the `filter` attribute
		route(':filter');

		// Render #app-template
		$('#tobuyapp').html(can.view('app-template', {}));

		// Start the router
		route.ready();
	});
});
