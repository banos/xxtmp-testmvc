/*global define */
'use strict';

define([
	'flight/lib/component',
	'app/store'
], function (defineComponent, dataStore) {
	function tobuys() {
		var filter;
		this.attributes({
			dataStore: dataStore
		});

		this.add = function (e, data) {
			var tobuy = this.attr.dataStore.save({
				title: data.title,
				completed: false
			});

			this.trigger('dataTodoAdded', { tobuy: tobuy, filter: filter });
		};

		this.remove = function (e, data) {
			var tobuy = this.attr.dataStore.destroy(data.id);

			this.trigger('dataTodoRemoved', tobuy);
		};

		this.load = function () {
			var tobuys;

			filter = localStorage.getItem('filter');
			tobuys = this.find();
			this.trigger('dataTodosLoaded', { tobuys: tobuys });
		};

		this.update = function (e, data) {
			this.attr.dataStore.save(data);
		};

		this.toggleCompleted = function (e, data) {
			var eventType;
			var tobuy = this.attr.dataStore.get(data.id);

			tobuy.completed = !tobuy.completed;
			this.attr.dataStore.save(tobuy);

			eventType = filter ? 'dataTodoRemoved' : 'dataTodoToggled';

			this.trigger(eventType, tobuy);
		};

		this.toggleAllCompleted = function (e, data) {
			this.attr.dataStore.updateAll({ completed: data.completed });
			this.trigger('dataTodoToggledAll', { tobuys: this.find(filter) });
		};

		this.filter = function (e, data) {
			var tobuys;

			localStorage.setItem('filter', data.filter);
			filter = data.filter;
			tobuys = this.find();

			this.trigger('dataTodosFiltered', { tobuys: tobuys });
		};

		this.find = function () {
			var tobuys;

			if (filter) {
				tobuys = this.attr.dataStore.find(function (each) {
					return (typeof each[filter] !== 'undefined') ? each.completed : !each.completed;
				});
			} else {
				tobuys = this.attr.dataStore.all();
			}

			return tobuys;
		};

		this.clearCompleted = function () {
			this.attr.dataStore.destroyAll({ completed: true });

			this.trigger('uiFilterRequested', { filter: filter });
			this.trigger('dataClearedCompleted');
		};

		this.after('initialize', function () {
			this.on(document, 'uiAddRequested', this.add);
			this.on(document, 'uiUpdateRequested', this.update);
			this.on(document, 'uiRemoveRequested', this.remove);
			this.on(document, 'uiLoadRequested', this.load);
			this.on(document, 'uiToggleRequested', this.toggleCompleted);
			this.on(document, 'uiToggleAllRequested', this.toggleAllCompleted);
			this.on(document, 'uiClearRequested', this.clearCompleted);
			this.on(document, 'uiFilterRequested', this.filter);
		});
	}

	return defineComponent(tobuys);
});
