/*global Backbone, microtemplate, ENTER_KEY */
var app = app || {};

(function () {
	'use strict';

	var toggleEl = function (el, toggle) {
		el.style.display = toggle ? '' : 'none';
	};

	var matchesSelector = function (node, selector) {
		return [].some.call(document.querySelectorAll(selector), function (el) {
			return el === node;
		});
	};

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#tobuyapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: microtemplate(document.querySelector('#stats-template').innerHTML),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-tobuy': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Tobuys`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting tobuys that might be saved in *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('#toggle-all').item(0);
			this.input = this.$('#new-tobuy').item(0);
			this.footer = this.$('#footer').item(0);
			this.main = this.$('#main').item(0);

			this.listenTo(app.tobuys, 'add', this.addOne);
			this.listenTo(app.tobuys, 'reset', this.addAll);
			this.listenTo(app.tobuys, 'change:completed', this.filterOne);
			this.listenTo(app.tobuys, 'filter', this.filterAll);
			this.listenTo(app.tobuys, 'all', this.render);

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.tobuys.fetch({reset: true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = app.tobuys.completed().length;
			var remaining = app.tobuys.remaining().length;
			var selector = '[href="#/' + (app.TobuyFilter || '') + '"]';

			if (app.tobuys.length) {
				// TOBUY
				toggleEl(this.main, true);
				toggleEl(this.footer, true);

				this.footer.innerHTML = this.statsTemplate({
					completed: completed,
					remaining: remaining
				});

				[].forEach.call(this.$('#filters li a'), function (el) {
					el.classList.remove('selected');
					if (matchesSelector(el, selector)) {
						el.classList.add('selected');
					}
				});

			} else {
				toggleEl(this.main, false);
				toggleEl(this.footer, false);
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single tobuy item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (tobuy) {
			var view = new app.TobuyView({ model: tobuy });
			document.querySelector('#tobuy-list').appendChild(view.render().el);
		},

		// Add all items in the **Tobuys** collection at once.
		addAll: function () {
			this.$('#tobuy-list').item(0).innerHTML = '';
			app.tobuys.forEach(this.addOne, this);
		},

		filterOne: function (tobuy) {
			tobuy.trigger('visible');
		},

		filterAll: function () {
			app.tobuys.forEach(this.filterOne, this);
		},

		// Generate the attributes for a new Tobuy item.
		newAttributes: function () {
			return {
				title: this.input.value.trim(),
				order: app.tobuys.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Tobuy** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which !== ENTER_KEY || !this.input.value.trim()) {
				return;
			}

			app.tobuys.create(this.newAttributes());
			this.input.value = '';
		},

		// Clear all completed tobuy items, destroying their models.
		clearCompleted: function () {
			app.tobuys.completed().forEach(function (tobuy) {
				tobuy.destroy();
			});
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.tobuys.forEach(function (tobuy) {
				tobuy.save({
					'completed': completed
				});
			});
		}
	});
})();
