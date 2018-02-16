/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/tobuys',
	'views/tobuys',
	'text!templates/stats.html',
	'common'
], function ($, _, Backbone, Tobuys, TobuyView, statsTemplate, Common) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#tobuyapp',

		// Compile our stats template
		template: _.template(statsTemplate),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-tobuy':		'createOnEnter',
			'click #clear-completed':	'clearCompleted',
			'click #toggle-all':		'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Tobuys`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting tobuys that might be saved in *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-tobuy');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$tobuyList = this.$('#tobuy-list');

			this.listenTo(Tobuys, 'add', this.addOne);
			this.listenTo(Tobuys, 'reset', this.addAll);
			this.listenTo(Tobuys, 'change:completed', this.filterOne);
			this.listenTo(Tobuys, 'filter', this.filterAll);
			this.listenTo(Tobuys, 'all', _.debounce(this.render, 0));

			Tobuys.fetch({reset:true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = Tobuys.completed().length;
			var remaining = Tobuys.remaining().length;

			if (Tobuys.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.template({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (Common.TobuyFilter || '') + '"]')
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
			var view = new TobuyView({ model: tobuy });
			this.$tobuyList.append(view.render().el);
		},

		// Add all items in the **Tobuys** collection at once.
		addAll: function () {
			this.$tobuyList.empty();
			Tobuys.each(this.addOne, this);
		},

		filterOne: function (tobuy) {
			tobuy.trigger('visible');
		},

		filterAll: function () {
			Tobuys.each(this.filterOne, this);
		},

		// Generate the attributes for a new Tobuy item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: Tobuys.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Tobuy** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which !== Common.ENTER_KEY || !this.$input.val().trim()) {
				return;
			}

			Tobuys.create(this.newAttributes());
			this.$input.val('');
		},

		// Clear all completed tobuy items, destroying their models.
		clearCompleted: function () {
			_.invoke(Tobuys.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			Tobuys.each(function (tobuy) {
				tobuy.save({
					completed: completed
				});
			});
		}
	});

	return AppView;
});
