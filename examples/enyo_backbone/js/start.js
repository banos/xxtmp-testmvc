/*jshint strict:false */
/*global enyo:false, ToBuy:false */
// Once everything is loaded through enyo's dependency management, start the app
enyo.ready(function () {
	var container = document.getElementById('tobuy-container');

	window.app = new ToBuy.Application();
	// add extra container to prevent enyo from blowing out the learn side bar
	window.app.renderInto(container);
});
