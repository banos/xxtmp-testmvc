/**
 * @author Mike Britton
 *
 * @class PrepModelCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define({
		name: 'tobuymvc.controller.command.PrepModelCommand',
		parent: puremvc.SimpleCommand
	},

	// INSTANCE MEMBERS
	{
		/**
		 * Register Proxies with the Model
		 * @override
		 */
		execute: function(note) {
			this.facade.registerProxy( new tobuymvc.model.proxy.TodoProxy() );
		}
	}
);
