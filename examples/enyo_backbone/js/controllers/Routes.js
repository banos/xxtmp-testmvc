/*jshint strict:false */
/*global enyo:false, ToBuy:false */
enyo.kind({
	kind: 'enyo.Router',
	name: 'ToBuy.Routes',
	// These are the routes to listen for, and the function to call when they occur.  A separate context can be provided but is unnecessary here.
	routes: [{
		path: '/active',
		handler: 'changeCollection'
	}, {
		path: '/completed',
		handler: 'changeCollection'
	}, {
		path: '/',
		'default': true,
		handler: 'changeCollection'
	}],
	// Set a property on our global controller
	changeCollection: function () {
		ToBuy.notepadcontroller.setRoute(this.current);
	}
});
