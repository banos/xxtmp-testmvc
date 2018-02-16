/**
 * @author Mike Britton, Cliff Hall
 *
 * @class PrepControllerCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define({
		name: 'tobuymvc.controller.command.PrepControllerCommand',
		parent: puremvc.SimpleCommand
	},

	// INSTANCE MEMBERS
	{
		/**
		 * Register Commands with the Controller
		 * @override
		 */
		execute: function (note) {
			// This registers multiple notes to a single command which performs different logic based on the note name.
			// In a more complex app, we'd usually be registering a different command to each notification name.
			this.facade.registerCommand( tobuymvc.AppConstants.ADD_TODO,                  tobuymvc.controller.command.TodoCommand );
			this.facade.registerCommand( tobuymvc.AppConstants.REMOVE_TODOS_COMPLETED,    tobuymvc.controller.command.TodoCommand );
			this.facade.registerCommand( tobuymvc.AppConstants.DELETE_TODO,               tobuymvc.controller.command.TodoCommand );
			this.facade.registerCommand( tobuymvc.AppConstants.UPDATE_TODO,               tobuymvc.controller.command.TodoCommand );
			this.facade.registerCommand( tobuymvc.AppConstants.TOGGLE_TODO_STATUS,        tobuymvc.controller.command.TodoCommand );
			this.facade.registerCommand( tobuymvc.AppConstants.FILTER_TODOS,              tobuymvc.controller.command.TodoCommand );
		}
	}
);
