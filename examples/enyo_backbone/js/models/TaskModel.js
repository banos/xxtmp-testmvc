/*jshint strict:false */
/*global enyo:false, ToBuy:false, Backbone:false */
enyo.ready(function () {
	ToBuy.TaskModel = Backbone.Model.extend({
		defaults: {
			title: '',
			completed: false
		}
	});
});
