/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '.tobuyapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress .new-tobuy': 'createOnEnter',
			'click .clear-completed': 'clearCompleted',
			'click .toggle-all': 'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Tobuys`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting tobuys that might be saved in *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('.toggle-all')[0];
			this.$input = this.$('.new-tobuy');
			this.$footer = this.$('.footer');
			this.$main = this.$('.main');
			this.$list = $('.tobuy-list');

			this.listenTo(app.tobuys, 'add', this.addOne);
			this.listenTo(app.tobuys, 'reset', this.addAll);
			this.listenTo(app.tobuys, 'change:completed', this.filterOne);
			this.listenTo(app.tobuys, 'filter', this.filterAll);
			this.listenTo(app.tobuys, 'all', _.debounce(this.render, 0));

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

			if (app.tobuys.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('.filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TobuyFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single tobuy item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (tobuy) {
			var view = new app.TobuyView({ model: tobuy });
			this.$list.append(view.render().el);
		},

		// Add all items in the **Tobuys** collection at once.
		addAll: function () {
			this.$list.html('');
			app.tobuys.each(this.addOne, this);
		},

		filterOne: function (tobuy) {
			tobuy.trigger('visible');
		},

		filterAll: function () {
			app.tobuys.each(this.filterOne, this);
		},

		// Generate the attributes for a new Tobuy item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.tobuys.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Tobuy** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.tobuys.create(this.newAttributes());
				this.$input.val('');
			}
		},

		// Clear all completed tobuy items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.tobuys.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.tobuys.each(function (tobuy) {
				tobuy.save({
					completed: completed
				});
			});
		}
	});
})(jQuery);
