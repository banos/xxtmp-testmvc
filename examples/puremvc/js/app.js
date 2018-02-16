/**
 * @author Mike Britton
 *
 * @class tobuymvc.Application
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define({
		name: 'tobuymvc.Application',
		constructor: function() {
			// register the startup command and trigger it.
			this.facade.registerCommand( tobuymvc.AppConstants.STARTUP, tobuymvc.controller.command.StartupCommand );
			this.facade.sendNotification( tobuymvc.AppConstants.STARTUP );
		}
	},

	// INSTANCE MEMBERS
	{
		// Define the startup notification name
		STARTUP: 'startup',

		// Get an instance of the PureMVC Facade. This creates the Model, View, and Controller instances.
		facade: puremvc.Facade.getInstance( tobuymvc.AppConstants.CORE_NAME )
	}
);
