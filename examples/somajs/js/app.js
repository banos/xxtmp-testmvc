/*global soma:false */
(function (tobuy, soma) {

	'use strict';

	tobuy.TobuyApp = soma.Application.extend({
		init: function () {
			// mapping rules so the model and router can be injected
			this.injector.mapClass('model', tobuy.Model, true);
			this.injector.mapClass('router', tobuy.Router, true);
			// create templates for DOM Elements (optional soma-template plugin)
			this.createTemplate(tobuy.HeaderView, document.getElementById('header'));
			this.createTemplate(tobuy.MainView, document.getElementById('main'));
			this.createTemplate(tobuy.FooterView, document.getElementById('footer'));
		},
		start: function () {
			// dispatch a custom event to render the templates
			this.dispatcher.dispatch('render');
		}
	});

	// create the application
	new tobuy.TobuyApp();

})(window.tobuy = window.tobuy || {}, soma);
