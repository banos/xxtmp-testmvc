/*global Sammy, jQuery, TobuyApp */

(function (window, $) {
	'use strict';

	window.TobuyApp = Sammy('#tobuyapp').use('Template');

	TobuyApp.notFound = function () {
		this.runRoute('get', '#/');
	};

	$(function () {
		TobuyApp.run('#/');
	});
})(window, jQuery);
