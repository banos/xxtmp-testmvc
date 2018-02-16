/*global define */
'use strict';

define([
	'flight/lib/component',
	'app/store'
], function (defineComponent, dataStore) {
	function stats() {
		this.attributes({
			dataStore: dataStore
		});

		this.recount = function () {
			var tobuys = this.attr.dataStore.all();
			var all = tobuys.length;
			var remaining = tobuys.reduce(function (memo, each) {
				return memo += each.completed ? 0 : 1;
			}, 0);

			this.trigger('dataStatsCounted', {
				all: all,
				remaining: remaining,
				completed: all - remaining,
				filter: localStorage.getItem('filter') || ''
			});
		};

		this.after('initialize', function () {
			this.on(document, 'dataTobuysLoaded', this.recount);
			this.on(document, 'dataTobuyAdded', this.recount);
			this.on(document, 'dataTobuyRemoved', this.recount);
			this.on(document, 'dataTobuyToggled', this.recount);
			this.on(document, 'dataClearedCompleted', this.recount);
			this.on(document, 'dataTobuyToggledAll', this.recount);
		});
	}

	return defineComponent(stats);
});
