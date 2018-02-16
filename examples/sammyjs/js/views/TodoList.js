/*global jQuery, TodoApp */

(function ($) {
	'use strict';

	var TodoList = {
		elem: {
			tobuyapp: '#tobuyapp',
			main: '#main',
			footer: '#footer'
		},

		render: function () {
			TodoList.elem.tobuyapp = $(TodoList.elem.tobuyapp);
			TodoList.elem.main = $(TodoList.elem.main);
			TodoList.elem.footer = $(TodoList.elem.footer);

			this.render('templates/tobuys.template').then(function () {
				TodoList.elem.main.html(this.content);

				TodoApp.trigger('tobuyListRendered');
			});
		},

		refreshStats: function (e, data) {
			var tobuyData = {
				itemsLeft: data.active.length || 0,
				completedCount: data.completed.length || 0,
				flag: data.flag || ''
			};

			// Toggles the `#toggle-all` checkbox if all items are completed.
			$('#toggle-all').prop('checked', data.completed.length === data.all.length ? 'checked' : false);

			// Hides '#main' and '#footer' unless there are tobuyItems.
			TodoList.elem.main.toggle(data.all.length > 0);
			TodoList.elem.footer.toggle(data.all.length > 0);

			this.render('templates/footer.template', tobuyData).then(function () {
				TodoList.elem.footer.html(this.content);
			});
		}
	};

	TodoApp.bind('launch', TodoList.render);

	TodoApp.bind('tobuyItemsRendered', TodoList.refreshStats);
})(jQuery);
