/*jshint strict:false */
/*global enyo:false, ToBuy:false, Backbone: false */
enyo.ready(function () {
	ToBuy.TaskCollection = Backbone.Collection.extend({
		localStorage: new Backbone.LocalStorage('tobuys-enyo'),
		model: ToBuy.TaskModel
	});
});
