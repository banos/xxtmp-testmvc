/*global Sammy, jQuery, TodoApp */

(function (window, $) {
	'use strict';

	window.TodoApp = Sammy('#tobuyapp').use('Template');

	TodoApp.notFound = function () {
		this.runRoute('get', '#/');
	};

	$(function () {
		TodoApp.run('#/');
	});
})(window, jQuery);
