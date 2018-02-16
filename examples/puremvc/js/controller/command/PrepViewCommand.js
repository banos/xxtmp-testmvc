/**
 * @author Mike Britton
 *
 * @class PrepViewCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define ({
		name: 'tobuymvc.controller.command.PrepViewCommand',
		parent: puremvc.SimpleCommand
	},

	// INSTANCE MEMBERS
	{
		/**
		 * Register Mediators with the View
		 * @override
		 */
		execute: function (note) {
			this.facade.registerMediator( new tobuymvc.view.mediator.TodoFormMediator() );
			this.facade.registerMediator( new tobuymvc.view.mediator.RoutesMediator() );
		}
	}
);
