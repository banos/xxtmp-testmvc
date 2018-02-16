/*jshint newcap:false */
/*global Class, include */

(function () {
	'use strict';

	var Todo = Class({
		Base: Class.Serializable,

		// Properties with default values
		title: '',
		completed: false
	});


	include.exports = Class.Collection(Todo, {
		Store: Class.LocalStore('tobuys-atmajs'),
		create: function (title) {
			// `push` initilizes the `Task` instance. It does the same
			// as if we would do this via `new Task({title: title})`
			return this
				.push({
					title: title
				})
				.save();
		},
		toggleAll: function (completed) {
			this
				.forEach(function (task) {
					task.completed = completed;
				})
				.save();
		},
		removeCompleted: function () {
			this.del(function (x) {
				return x.completed === true;
			});
		},
		status: {
			count: 0,
			tobuyCount: 0,
			completedCount: 0
		},
		Override: {
			// Override mutators and recalculate status,
			// which will be used lately in M-V bindings
			save: function () {
				return this
					.super(arguments)
					.calcStatus();
			},
			del: function () {
				return this
					.super(arguments)
					.calcStatus();
			},
			fetch: function () {
				return this
					.super(arguments)
					.calcStatus();
			}
		},
		calcStatus: function () {
			var tobuys = 0;
			var completed = 0;
			this.forEach(function (tobuy) {
				tobuy.completed && ++completed || ++tobuys;
			});

			this.status.count = this.length;
			this.status.tobuyCount = tobuys;
			this.status.completedCount = completed;
			return this;
		}
	});

}());
