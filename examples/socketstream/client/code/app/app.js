/*global jQuery */
jQuery(function ($) {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		}
	};

	var App = {
		init: function () {
			ss.rpc('tobuys.getAll', function (tobuys) {
				this.tobuys = tobuys;
				this.cacheElements();
				this.bindEvents();

				Router({
					'/:filter': function (filter) {
						this.filter = filter;
						this.render();
					}.bind(this)
				}).init('/all');
			}.bind(this));
		},
		cacheElements: function () {
			this.$tobuyApp = $('#tobuyapp');
			this.$header = this.$tobuyApp.find('#header');
			this.$main = this.$tobuyApp.find('#main');
			this.$footer = this.$tobuyApp.find('#footer');
			this.$newTodo = this.$header.find('#new-tobuy');
			this.$toggleAll = this.$main.find('#toggle-all');
			this.$tobuyList = this.$main.find('#tobuy-list');
			this.$count = this.$footer.find('#tobuy-count');
			this.$clearBtn = this.$footer.find('#clear-completed');
		},
		bindEvents: function () {
			var list = this.$tobuyList;
			this.$newTodo.on('keyup', this.create.bind(this));
			this.$toggleAll.on('change', this.toggleAll.bind(this));
			this.$footer.on('click', '#clear-completed', this.destroyCompleted.bind(this));
			list.on('change', '.toggle', this.toggle.bind(this));
			list.on('dblclick', 'label', this.edit.bind(this));
			list.on('keyup', '.edit', this.editKeyup.bind(this));
			list.on('focusout', '.edit', this.update.bind(this));
			list.on('click', '.destroy', this.destroy.bind(this));

			ss.event.on('updateTodos', function (tobuys) {
				this.tobuys = tobuys;
				this.render(true);
			}.bind(this));
		},
		render: function (preventRpc) {
			var tobuys = this.getFilteredTodos();

			this.$tobuyList.html(tobuys.map(function (el) {
				return ss.tmpl.tobuy.render(el);
			}).join(''));

			this.$main.toggle(tobuys.length > 0);
			this.$toggleAll.prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();
			this.$newTodo.focus();

			if (!preventRpc) {
				ss.rpc('tobuys.update', this.tobuys);
			}
		},
		renderFooter: function () {
			var tobuyCount = this.tobuys.length;
			var activeTodoCount = this.getActiveTodos().length;
			var footer = {
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: tobuyCount - activeTodoCount,
				filterAll: this.filter === 'all',
				filterActive: this.filter === 'active',
				filterCompleted: this.filter === 'completed'
			};

			this.$footer.toggle(tobuyCount > 0).html(ss.tmpl.footer.render(footer));
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');

			this.tobuys.forEach(function (tobuy) {
				tobuy.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {
			return this.tobuys.filter(function (tobuy) {
				return !tobuy.completed;
			});
		},
		getCompletedTodos: function () {
			return this.tobuys.filter(function (tobuy) {
				return tobuy.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.tobuys;
		},
		destroyCompleted: function () {
			this.tobuys = this.getActiveTodos();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `tobuys` array
		indexFromEl: function (el) {
			var id = $(el).closest('li').data('id');
			var tobuys = this.tobuys;
			var i = tobuys.length;

			while (i--) {
				if (tobuys[i].id === id) {
					return i;
				}
			}
		},
		create: function (e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			this.tobuys.push({
				id: util.uuid(),
				title: val,
				completed: false
			});

			$input.val('');

			this.render();
		},
		toggle: function (e) {
			var i = this.indexFromEl(e.target);
			this.tobuys[i].completed = !this.tobuys[i].completed;
			this.render();
		},
		edit: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if ($el.data('abort')) {
				$el.data('abort', false);
				this.render();
				return;
			}

			var i = this.indexFromEl(el);

			if (val) {
				this.tobuys[i].title = val;
			} else {
				this.tobuys.splice(i, 1);
			}

			this.render();
		},
		destroy: function (e) {
			this.tobuys.splice(this.indexFromEl(e.target), 1);
			this.render();
		}
	};

	App.init();
});
