/*global Knockback */
var app = app || {};

(function () {
	'use strict';

	var ENTER_KEY = 13;

	// Application View Model
	// ---------------

	// The application View Model is created and bound from the HTML using kb-inject.
	window.AppViewModel = kb.ViewModel.extend({
		constructor: function () {
			var self = this;
			kb.ViewModel.prototype.constructor.call(this);

			// New tobuy title.
			this.title = ko.observable('');

			// The function used for filtering is dynamically selected based on the filterMode.
			this.filterMode = ko.observable('');
			var filterFn = ko.computed(function () {
				switch (self.filterMode()) {
					case 'active':
						return (function (model) { return !model.get('completed'); });
					case 'completed':
						return (function (model) { return model.get('completed'); });
				};
				return (function () { return true; });
			});

			// A collectionObservable can be used to hold the instance of the collection.
			this.tobuys = kb.collectionObservable(new app.Tobuys(), app.TobuyViewModel, {filters: filterFn});

			// Note: collectionObservables do not track nested model attribute changes by design to avoid
			// list redrawing when models change so changes need to be manually tracked and triggered.
			this.tobuyAttributesTrigger = kb.triggeredObservable(this.tobuys.collection(), 'change add remove');
			this.tobuyStats = ko.computed(function () {
				self.tobuyAttributesTrigger(); // manual dependency on model attribute changes
				return {
					tasksExist: !!self.tobuys.collection().length,
					completedCount: self.tobuys.collection().where({completed: true}).length,
					remainingCount: self.tobuys.collection().where({completed: false}).length
				};
			});

			// When the checkbox state is written to the observable, all of the models are updated
			this.toggleCompleted = ko.computed({
				read: function () { return !self.tobuyStats().remainingCount; },
				write: function (value) { self.tobuys.collection().each(function (model) { model.save({completed: value}); }); }
			});

			// Fetch the tobuys and the collectionObservable will update once the models are loaded
			this.tobuys.collection().fetch();

			// Use a Backbone router to update the filter mode
			new Backbone.Router().route('*filter', null, function (filter) { self.filterMode(filter || ''); });
			Backbone.history.start();
		},

		// Create a new model in the underlying collection and the observable will automatically synchronize
		onAddTobuy: function (self, e) {
			if (e.keyCode === ENTER_KEY && $.trim(self.title())) {
				self.tobuys.collection().create({title: $.trim(self.title())});
				self.title('');
			}
		},

		// Operate on the underlying collection instead of the observable given the observable could be filtered
		onClearCompleted: function (self) { _.invoke(self.tobuys.collection().where({completed: true}), 'destroy'); },

		// Helper function to keep expressions out of markup
		getLabel: function (count) { return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items'; }
	});
})();
