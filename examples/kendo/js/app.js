/*global $ kendo*/
var app = app || {};

(function ($, kendo) {
	'use strict';

	var filterBase = {
		field: 'completed',
		operator: 'eq'
	};

	// Route object to manage filtering the tobuy item list
	var router = new kendo.Router();

	router.route('/', function () {
		app.tobuyData.filter({});
		app.tobuyViewModel.set('filter', '');
	});

	router.route('/active', function () {
		filterBase.value = false;
		app.tobuyData.filter(filterBase);
		app.tobuyViewModel.set('filter', 'active');
	});

	router.route('/completed', function () {
		filterBase.value = true;
		app.tobuyData.filter(filterBase);
		app.tobuyViewModel.set('filter', 'completed');
	});

	// Tobuy Model Object
	app.Tobuy = kendo.data.Model.define({
		id: 'id',
		fields: {
			id: { editable: false, nullable: true },
			title: { type: 'string' },
			completed: { type: 'boolean', nullable: false, defaultValue: false },
			edit: { type: 'boolean', nullable: false, defaultValue: false }
		}
	});

	// The Tobuy DataSource. This is a custom DataSource that extends the
	// Kendo UI DataSource and adds custom transports for saving data to
	// localStorage.
	// Implementation in js/lib/kendo.data.localstoragedatasource.ds
	app.tobuyData = new kendo.data.extensions.LocalStorageDataSource({
		itemBase: 'tobuys-kendo',
		schema: {
			model: app.Tobuy
		},
		change: function () {
			var completed = $.grep(this.data(), function (el) {
				return el.get('completed');
			});

			app.tobuyViewModel.set('allCompleted', completed.length === this.data().length);
		}
	});

	// The core ViewModel for our tobuy app
	app.tobuyViewModel = kendo.observable({
		tobuys: app.tobuyData,
		filter: null,

		// Main element visibility handler
		isVisible: function () {
			return this.get('tobuys').data().length ? '' : 'hidden';
		},

		// new tobuy value
		newTobuy: null,

		// Core CRUD Methods
		saveTobuy: function () {
			var tobuys = this.get('tobuys');
			var newTobuy = this.get('newTobuy');

			var tobuy = new app.Tobuy({
				title: newTobuy.trim(),
				completed: false,
				edit: false
			});

			tobuys.add(tobuy);
			tobuys.sync();
			this.set('newTobuy', null);
		},

		toggleAll: function () {

			var completed = this.completedTobuys().length === this.get('tobuys').data().length;

			$.grep(this.get('tobuys').data(), function (el) {
				el.set('completed', !completed);
			});
		},
		startEdit: function (e) {
			e.data.set('edit', true);
			this.set('titleCache', e.data.get('title'));
			$(e.target).closest('li').find('input').focus();
		},
		endEdit: function (e) {
			var editData = e,
				title;

			if (e.data) {
				editData = e.data;
				title = e.data.get('title');

				// If the tobuy has a title, set it's edit property
				// to false. Otherwise, delete it.
				if (editData.title.trim()) {
					editData.set('title', title.trim());
				} else {
					this.destroy(e);
				}
			}

			this.tobuys.sync();
			editData.set('edit', false);
		},
		cancelEdit: function (e) {
			e.set('title', this.get('titleCache'));
			e.set('edit', false);
			this.tobuys.sync();
		},

		sync: function () {
			this.get('tobuys').sync();
		},
		destroy: function (e) {
			this.tobuys.remove(e.data);
			this.tobuys.sync();
		},
		destroyCompleted: function () {
			$.each(this.completedTobuys(), function (index, value) {
				this.tobuys.remove(value);
			}.bind(this));
			this.tobuys.sync();
		},

		// Methods for retrieving filtered tobuys and count values
		activeTobuys: function () {
			return $.grep(this.get('tobuys').data(), function (el) {
				return !el.get('completed');
			});
		},
		activeCount: function () {
			return this.activeTobuys().length;
		},
		completedTobuys: function () {
			return $.grep(this.get('tobuys').data(), function (el) {
				return el.get('completed');
			});
		},
		completedCount: function () {
			return this.completedTobuys().length;
		},

		allCompleted: false,

		// Text value bound methods
		activeCountText: function () {
			return this.activeCount() === 1 ? 'item' : 'items';
		},

		// Class attribute bound methods
		tobuyItemClass: function (item) {
			if (item.get('edit')) {
				return 'editing';
			}

			return (item.get('completed') ? 'completed' : 'active');
		},
		allFilterClass: function () {
			return this.get('filter') ? '' : 'selected';
		},
		activeFilterClass: function () {
			return this.get('filter') === 'active' ? 'selected' : '';
		},
		completedFilterClass: function () {
			return this.get('filter') === 'completed' ? 'selected' : '';
		}

	});

	// Bind the ViewModel to the tobuyapp DOM element
	kendo.bind($('#tobuyapp'), app.tobuyViewModel);

	router.start();

}($, kendo));
