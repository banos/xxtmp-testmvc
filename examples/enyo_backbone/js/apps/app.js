/*jshint strict:false */
/*global enyo:false */
// Base component.  This is the app that holds everything.  An app can be as big as the whole app or as big as a single module.
enyo.kind({
	name: 'ToBuy.Application',
	kind: 'enyo.Application',
	view: 'ToBuy.WindowView',
	// start up the controllers.  By giving them names and starting them at the app level, the instances become global singletons.
	controllers: [{
		name: 'ToBuy.notepadcontroller',
		kind: 'ToBuy.NotepadController'
	}, {
		name: 'ToBuy.routes',
		kind: 'ToBuy.Routes'
	}]
});
