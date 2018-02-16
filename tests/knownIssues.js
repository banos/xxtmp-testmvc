module.exports = [

	// durandal routing is very very slow.
	// see: https://github.com/tastejs/tobuymvc/issues/831
	'TobuyMVC - durandal, Routing, should allow me to display active items',
	'TobuyMVC - durandal, Routing, should allow me to display completed items',
	'TobuyMVC - durandal, Routing, should allow me to display all items',
	'TobuyMVC - durandal, Routing, should highlight the currently applied filter',

	// https://github.com/tastejs/tobuymvc/issues/828
	// routing should default to all
	'TobuyMVC - sammyjs, Routing, should highlight the currently applied filter',

	// https://github.com/tastejs/tobuymvc/issues/824
	// this implementation has numerous edit experience issues
	'TobuyMVC - angularjs_require, Mark all as completed, should allow me to mark all items as completed',
	'TobuyMVC - angularjs_require, Mark all as completed, should allow me to clear the completion state of all items',
	// jscs:disable
	'TobuyMVC - angularjs_require, Mark all as completed, complete all checkbox should update state when items are completed / cleared',

	// jscs:enable
	// https://github.com/tastejs/tobuymvc/issues/815
	// does not hide other controls while editing
	'TobuyMVC - dojo, Editing, should hide other controls when editing',

	// https://github.com/tastejs/tobuymvc/issues/816
	// atma does not hide the main section, instead it hides the toggle-all checkbox
	'TobuyMVC - atmajs, No Tobuys, should hide #main and #footer',

	// https://github.com/tastejs/tobuymvc/issues/819
	// the edit experience with soma is quite broken. You can
	// get multiple elements into an edit state
	'TobuyMVC - somajs_require, Editing, should remove the item if an empty text string was entered',
	'TobuyMVC - somajs_require, Editing, should cancel edits on escape',

	// the following are covered by the following issue:
	// https://github.com/tastejs/tobuymvc/issues/789
	'TobuyMVC - closure, Editing, should cancel edits on escape',
	'TobuyMVC - ariatemplates, Editing, should cancel edits on escape',
	'TobuyMVC - dermis, Editing, should cancel edits on escape',
	'TobuyMVC - duel, Editing, should cancel edits on escape',
	'TobuyMVC - extjs_deftjs, Editing, should cancel edits on escape',
	'TobuyMVC - olives, Editing, should cancel edits on escape',
	'TobuyMVC - rappidjs, Editing, should cancel edits on escape',
	'TobuyMVC - serenadejs, Editing, should cancel edits on escape',
	'TobuyMVC - typescript-angular, Editing, should cancel edits on escape',
	'TobuyMVC - flight, Editing, should cancel edits on escape',
	'TobuyMVC - backbone_require, Editing, should cancel edits on escape',
	'TobuyMVC - dijon, Editing, should cancel edits on escape',
	'TobuyMVC - knockoutjs_require, Editing, should cancel edits on escape',

	// all the following are covered by this issue:
	// https://github.com/tastejs/tobuymvc/issues/856
	'TobuyMVC - knockoutjs, Routing, should respect the back button',
	'TobuyMVC - spine, Routing, should respect the back button',
	'TobuyMVC - serenadejs, Routing, should respect the back button',
	'TobuyMVC - flight, Routing, should respect the back button',
	'TobuyMVC - lavaca_require, Routing, should respect the back button',
	'TobuyMVC - somajs_require, Routing, should respect the back button',

	// the following implementations do not support routing
	'TobuyMVC - extjs_deftjs, Routing, should allow me to display active items',
	'TobuyMVC - extjs_deftjs, Routing, should allow me to display completed items',
	'TobuyMVC - extjs_deftjs, Routing, should allow me to display all items',
	'TobuyMVC - extjs_deftjs, Routing, should highlight the currently applied filter',
	'TobuyMVC - extjs_deftjs, Routing, should respect the back button',
	'TobuyMVC - olives, Routing, should allow me to display active items',
	'TobuyMVC - olives, Routing, should allow me to display completed items',
	'TobuyMVC - olives, Routing, should allow me to display all items',
	'TobuyMVC - olives, Routing, should highlight the currently applied filter',
	'TobuyMVC - olives, Routing, should respect the back button',
	'TobuyMVC - dijon, Routing, should allow me to display active items',
	'TobuyMVC - dijon, Routing, should allow me to display completed items',
	'TobuyMVC - dijon, Routing, should allow me to display all items',
	'TobuyMVC - dijon, Routing, should highlight the currently applied filter',
	'TobuyMVC - dijon, Routing, should respect the back button',
	'TobuyMVC - duel, Routing, should allow me to display active items',
	'TobuyMVC - duel, Routing, should allow me to display completed items',
	'TobuyMVC - duel, Routing, should allow me to display all items',
	'TobuyMVC - duel, Routing, should highlight the currently applied filter',
	'TobuyMVC - duel, Routing, should respect the back button',
	'TobuyMVC - knockoutjs_require, Routing, should allow me to display active items',
	'TobuyMVC - knockoutjs_require, Routing, should allow me to display completed items',
	'TobuyMVC - knockoutjs_require, Routing, should allow me to display all items',
	'TobuyMVC - knockoutjs_require, Routing, should highlight the currently applied filter',
	'TobuyMVC - knockoutjs_require, Routing, should respect the back button',
	'TobuyMVC - angular-dart, Routing, should allow me to display active items',
	'TobuyMVC - angular-dart, Routing, should allow me to display completed items',
	'TobuyMVC - angular-dart, Routing, should allow me to display all items',
	'TobuyMVC - angular-dart, Routing, should highlight the currently applied filter',
	'TobuyMVC - angular-dart, Routing, should respect the back button',
	'TobuyMVC - typescript-backbone, Routing, should allow me to display active items',
	'TobuyMVC - typescript-backbone, Routing, should allow me to display completed items',
	'TobuyMVC - typescript-backbone, Routing, should allow me to display all items',
	'TobuyMVC - typescript-backbone, Routing, should highlight the currently applied filter',
	'TobuyMVC - typescript-backbone, Routing, should respect the back button',

	// EXTJS is not spec compliant (by a long way!)
	'TobuyMVC - extjs, New Tobuy, should show #main and #footer when items added',
	'TobuyMVC - extjs, Mark all as completed, should allow me to mark all items as completed',
	'TobuyMVC - extjs, Mark all as completed, complete all checkbox should update state when items are completed / cleared',
	'TobuyMVC - extjs, Item, should allow me to mark items as complete',
	'TobuyMVC - extjs, Item, should allow me to un-mark items as complete',
	'TobuyMVC - extjs, Editing, should save edits on blur',
	'TobuyMVC - extjs, Editing, should cancel edits on escape',
	'TobuyMVC - extjs, Counter, should display the current number of tobuy items',
	'TobuyMVC - extjs, Clear completed button, should display the number of completed items',
	'TobuyMVC - extjs, Clear completed button, should remove completed items when clicked',
	'TobuyMVC - extjs, Clear completed button, should be hidden when there are no items that are completed',
	'TobuyMVC - extjs, Persistence, should persist its data',
	'TobuyMVC - extjs, Routing, should allow me to display active items',
	'TobuyMVC - extjs, Routing, should allow me to display completed items',
	'TobuyMVC - extjs, Routing, should allow me to display all items',
	'TobuyMVC - extjs, Routing, should highlight the currently applied filter',
	'TobuyMVC - extjs, Routing, should respect the back button',

	// ----------------- Test framework issues -----------

	// for some reason the persistence test fails for knockout, even though persistence is working
	// just fine. Perhaps there is something asynchronous going on that is causing the assert
	// to be executed early?
	'TobuyMVC - knockoutjs, Persistence, should persist its data',

	// chaplin edit tests fail with the following:
	// StaleElementReferenceError: stale element reference: element is not attached to the page document
	'TobuyMVC - chaplin-brunch, Editing, should save edits on enter',
	'TobuyMVC - chaplin-brunch, Editing, should save edits on blur',
	'TobuyMVC - chaplin-brunch, Editing, should trim entered text',
	'TobuyMVC - chaplin-brunch, Editing, should remove the item if an empty text string was entered',
	'TobuyMVC - chaplin-brunch, Editing, should cancel edits on escape'
];
