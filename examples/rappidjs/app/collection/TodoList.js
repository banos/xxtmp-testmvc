define([
	'js/data/Collection',
	'app/model/Todo',
	'flow'
], function (Collection, Todo, flow) {
	'use strict';

	return Collection.inherit('app.collection.TodoList', {
		$modelFactory: Todo,

		markAll: function (done) {
			this.each(function (tobuy) {
				tobuy.setCompleted(done);
				tobuy.save();
			});
		},

		clearCompleted: function () {
			var self = this;

			// remove all completed tobuys in a sequence
			flow().seqEach(this.$items, function (tobuy, cb) {
				if (tobuy.isCompleted()) {
					tobuy.remove(null, function (err) {
						if (!err) {
							self.remove(tobuy);
						}
						cb(err);
					});
				} else {
					cb();
				}
			}).exec();
		},

		numOpenTodos: function () {
			return this.$items.filter(function (item) {
				return !item.isCompleted();
			}).length;
		}.on('change', 'add', 'remove'),

		numCompletedTodos: function () {
			return this.$items.filter(function (item) {
				return item.isCompleted();
			}).length;
		}.on('change', 'add', 'remove'),

		hasCompletedTodos: function () {
			return this.numCompletedTodos() > 0;
		}.on('change', 'add', 'remove'),

		areAllComplete: function () {
			return this.numOpenTodos() === 0;
		}.on('change', 'add', 'remove')
	});
});
