/*global define, $ */
'use strict';

define([
	'flight/lib/component',
	'text!templates/tobuy.html',
	'app/utils'
], function (defineComponent, tobuyTmpl, utils) {
	function tobuyList() {
		var ENTER_KEY = 13;
		var template = utils.tmpl(tobuyTmpl);

		this.attributes({
			destroySelector: 'button.destroy',
			toggleSelector: 'input.toggle',
			labelSelector: 'label',
			editSelector: '.edit'
		});

		this.renderAll = function (e, data) {
			this.$node.html('');
			data.tobuys.forEach(function (each) {
				this.render(e, { tobuy: each });
			}, this);
		};

		this.render = function (e, data) {
			if (e.type === 'dataTodoAdded' && data.filter === 'completed') {
				return;
			}

			this.$node.append(template(data.tobuy));
		};

		this.edit = function (e, data) {
			var $tobuyEl = $(data.el).parents('li');

			$tobuyEl.addClass('editing');
			this.select('editSelector').focus();
		};

		this.requestUpdate = function (e) {
			var $inputEl = $(e.currentTarget);
			var $tobuyEl = $inputEl.parents('li');
			var value = $inputEl.val().trim();
			var id = $tobuyEl.attr('id');

			if (!$tobuyEl.hasClass('editing')) {
				return;
			}

			$tobuyEl.removeClass('editing');

			if (value) {
				$tobuyEl.find('label').html(value);
				this.trigger('uiUpdateRequested',  { id: id, title: value });
			} else {
				this.trigger('uiRemoveRequested', { id: id });
			}
		};

		this.requestUpdateOnEnter = function (e, data) {
			if (e.which === ENTER_KEY) {
				this.requestUpdate(e, data);
			}
		};

		this.requestRemove = function (e, data) {
			var id = $(data.el).attr('id').split('_')[1];
			this.trigger('uiRemoveRequested', { id: id });
		};

		this.remove = function (e, data) {
			var $tobuyEl = this.$node.find('#' + data.id);
			$tobuyEl.remove();
		};

		this.toggle = function (e, data) {
			var $tobuyEl = $(data.el).parents('li');

			$tobuyEl.toggleClass('completed');
			this.trigger('uiToggleRequested', { id: $tobuyEl.attr('id') });
		};

		this.after('initialize', function () {
			this.on(document, 'dataTodoAdded', this.render);
			this.on(document, 'dataTodosLoaded', this.renderAll);
			this.on(document, 'dataTodosFiltered', this.renderAll);
			this.on(document, 'dataTodoToggledAll', this.renderAll);
			this.on(document, 'dataTodoRemoved', this.remove);

			this.on('click', { 'destroySelector': this.requestRemove });
			this.on('click', { 'toggleSelector': this.toggle });
			this.on('dblclick', { 'labelSelector': this.edit });

			this.$node.on('blur', '.edit', this.requestUpdate.bind(this));
			this.$node.on('keydown', '.edit', this.requestUpdateOnEnter.bind(this));

			// these don't work
			// this.on(this.attr.editSelector, 'blur', this.requestUpdate);
			// this.on('blur', { 'editSelector': this.requestUpdate });

			this.trigger('uiLoadRequested');
		});
	}

	return defineComponent(tobuyList);
});
