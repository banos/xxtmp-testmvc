/*global jQuery, TodoApp */

(function ($) {
	'use strict';

	var TodoItem = {
		renderAllTodos: function (e, data) {
			this.renderEach('templates/tobuyItem.template', data.visible).then(function () {
				$('#tobuy-list').html(this.content);

				TodoApp.trigger('tobuyItemsRendered', data);
			});
		},

		toggleCompleteClass: function (e, data) {
			if (data.completed) {
				$('[data-id="' + data.id + '"]').addClass('completed');
			} else {
				$('[data-id="' + data.id + '"]').removeClass('completed');
			}
		},

		editingTodo: function (e, data) {
			var tobuy = $('[data-id="' + data.id + '"]');

			tobuy.addClass('editing');

			tobuy.find('.edit').focus().val(tobuy.find('.edit').val());
		},

		doneEditingTodo: function (e, data) {
			var tobuy = $('[data-id="' + data.id + '"]');

			tobuy.removeClass('editing');

			if (data.name) {
				tobuy.find('label').text(data.name);
				tobuy.find('.edit').val(data.name);
			}
		}
	};

	TodoApp.bind('tobuysUpdated', TodoItem.renderAllTodos);

	TodoApp.bind('toggleAllTodosCompleted', TodoItem.toggleCompleteClass);
	TodoApp.bind('toggledTodoCompleted', TodoItem.toggleCompleteClass);

	TodoApp.bind('editingTodo', TodoItem.editingTodo);
	TodoApp.bind('cancelEditingTodo', TodoItem.doneEditingTodo);
	TodoApp.bind('doneEditingTodo', TodoItem.doneEditingTodo);
})(jQuery);
