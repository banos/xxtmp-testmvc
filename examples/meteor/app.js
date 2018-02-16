// Collection to keep the tobuys
Todos = new Meteor.Collection('tobuys');

// JS code for the client (browser)
if (Meteor.isClient) {

	// Session var to keep current filter type ("all", "active", "completed")
	Session.set('filter', 'all');

	// Session var to keep tobuy which is currently in editing mode, if any
	Session.set('editing_tobuy', null);

	// Set up filter types and their mongo db selectors
	var filter_selections = {
		all: {},
		active: {completed: false},
		completed: {completed: true}
	};

	// Get selector types as array
	var filters = _.keys(filter_selections);

	// Bind route handlers to filter types
	var routes = {};
	_.each(filters, function(filter) {
		routes['/'+filter] = function() {
			Session.set('filter', filter);
		};
	});

	// Initialize router with routes
	var router = Router(routes);
	router.init();

	/////////////////////////////////////////////////////////////////////////
	// The following two functions are taken from the official Meteor
	// "Todos" example
	// The original code can be viewed at: https://github.com/meteor/meteor
	/////////////////////////////////////////////////////////////////////////

	// Returns an event_map key for attaching "ok/cancel" events to
	// a text input (given by selector)
	var okcancel_events = function (selector) {
		return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
	};

	// Creates an event handler for interpreting "escape", "return", and "blur"
	// on a text field and calling "ok" or "cancel" callbacks.
	var make_okcancel_handler = function (options) {
		var ok = options.ok || function () {};
		var cancel = options.cancel || function () {};

		return function (evt) {
			if (evt.type === 'keydown' && evt.which === 27) {
				// escape = cancel
				cancel.call(this, evt);

			} else if (evt.type === 'keyup' && evt.which === 13 ||
				evt.type === 'focusout') {
				// blur/return/enter = ok/submit if non-empty
				var value = String(evt.target.value || '');
				if (value) {
					ok.call(this, value, evt);
				} else {
					cancel.call(this, evt);
				}
			}
		};
	};

	// Some helpers

	// Get the number of tobuys completed
	var tobuys_completed_helper = function() {
		return Todos.find({completed: true}).count();
	};

	// Get the number of tobuys not completed
	var tobuys_not_completed_helper = function() {
		return Todos.find({completed: false}).count();
	};

	////
	// Logic for the 'tobuyapp' partial which represents the whole app
	////

	// Helper to get the number of tobuys
	Template.tobuyapp.tobuys = function() {
		return Todos.find().count();
	};

	Template.tobuyapp.events = {};

	// Register key events for adding new tobuy
	Template.tobuyapp.events[okcancel_events('#new-tobuy')] =
		make_okcancel_handler({
			ok: function (title, evt) {
				Todos.insert({title: $.trim(title), completed: false,
					created_at: new Date().getTime()});
				evt.target.value = '';
			}
		});

	////
	// Logic for the 'main' partial which wraps the actual tobuy list
	////

	// Get the tobuys considering the current filter type
	Template.main.tobuys = function() {
		return Todos.find(filter_selections[Session.get('filter')], {sort: {created_at: 1}});
	};

	Template.main.tobuys_not_completed = tobuys_not_completed_helper;

	// Register click event for toggling complete/not complete button
	Template.main.events = {
		'click input#toggle-all': function(evt) {
			var completed = true;
			if (!Todos.find({completed: false}).count()) {
				completed = false;
			}
			Todos.find({}).forEach(function(tobuy) {
				Todos.update({'_id': tobuy._id}, {$set: {completed: completed}});
			});
		}
	};

	////
	// Logic for the 'tobuy' partial representing a tobuy
	////

	// True of current tobuy is completed, false otherwise
	Template.tobuy.tobuy_completed = function() {
		return this.completed;
	};

	// Get the current tobuy which is in editing mode, if any
	Template.tobuy.tobuy_editing = function() {
		return Session.equals('editing_tobuy', this._id);
	};

	// Register events for toggling tobuy's state, editing mode and destroying a tobuy
	Template.tobuy.events = {
		'click input.toggle': function() {
			Todos.update(this._id, {$set: {completed: !this.completed}});
		},
		'dblclick label': function() {
			Session.set('editing_tobuy', this._id);
		},
		'click button.destroy': function() {
			Todos.remove(this._id);
		}
	};

	// Register key events for updating title of an existing tobuy
	Template.tobuy.events[okcancel_events('li.editing input.edit')] =
		make_okcancel_handler({
			ok: function (value) {
				Session.set('editing_tobuy', null);
				Todos.update(this._id, {$set: {title: $.trim(value)}});
			},
			cancel: function () {
				Session.set('editing_tobuy', null);
				Todos.remove(this._id);
			}
		});

	////
	// Logic for the 'footer' partial
	////

	Template.footer.tobuys_completed = tobuys_completed_helper;

	Template.footer.tobuys_not_completed = tobuys_not_completed_helper;

	// True if exactly one tobuy is not completed, false otherwise
	// Used for handling pluralization of "item"/"items" word
	Template.footer.tobuys_one_not_completed = function() {
		return Todos.find({completed: false}).count() == 1;
	};

	// Prepare array with keys of filter_selections only
	Template.footer.filters = filters;

	// True if the requested filter type is currently selected,
	// false otherwise
	Template.footer.filter_selected = function(type) {
		return Session.equals('filter', type);
	};

	// Register click events for clearing completed tobuys
	Template.footer.events = {
		'click button#clear-completed': function() {
			Meteor.call('clearCompleted');
		}
	};
}

//Publish and subscribe setting
if (Meteor.isServer) {
	Meteor.publish('tobuys', function () {
		return Todos.find();
	});
}

if (Meteor.isClient) {
	Meteor.subscribe('tobuys');
}

//Allow users to write directly to this collection from client code, subject to limitations you define.
if (Meteor.isServer) {
	Todos.allow({
		insert: function () {
			return true;
		},
		update: function () {
			return true;
		},
		remove: function () {
			return true;
		}
	});
}

//Defines functions that can be invoked over the network by clients.
Meteor.methods({
	clearCompleted: function () {
		Todos.remove({completed: true});
	}
});