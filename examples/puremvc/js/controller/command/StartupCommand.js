/**
 * @author Mike Britton
 *
 * @class StartupCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define({
		name: 'tobuymvc.controller.command.StartupCommand',
		parent: puremvc.MacroCommand
	},

	// INSTANCE MEMBERS
	{
		/**
		 * Add the sub-commands for this MacroCommand
		 * @override
		 */
		initializeMacroCommand: function () {
			this.addSubCommand( tobuymvc.controller.command.PrepControllerCommand );
			this.addSubCommand( tobuymvc.controller.command.PrepModelCommand );
			this.addSubCommand( tobuymvc.controller.command.PrepViewCommand );
		}
	}
);
