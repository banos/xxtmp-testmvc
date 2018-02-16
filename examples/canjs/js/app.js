/* global $, can */
(function () {
	'use strict';

	$(function () {
		// Set up a route that maps to the `filter` attribute
		can.route(':filter');

		// Render #app-template
		$('#tobuyapp').html(can.view('app-template', {}));

		// Start the router
		can.route.ready();
	});
})();
