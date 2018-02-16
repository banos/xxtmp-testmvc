/**
 * @author Cliff Hall
 *
 * @class RoutesMediator
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define({
		name: 'tobuymvc.view.mediator.RoutesMediator',
		parent: puremvc.Mediator
	},

	// INSTANCE MEMBERS
	{
		// the router (Flatirion Director)
		router: null,

		// setup the routes when mediator is registered
		onRegister: function() {

			var tobuyProxy    = this.facade.retrieveProxy( tobuymvc.model.proxy.TodoProxy.NAME ),
				defaultRoute = this.getRouteForFilter( tobuyProxy.filter ),
				options      = { resource:this, notfound:this.handleFilterAll },
				routes       = {
					'/':            this.handleFilterAll,
					'/active':      this.handleFilterActive,
					'/completed':   this.handleFilterCompleted
				};

			this.router = new Router( routes ).configure( options );
			this.router.init( defaultRoute );
		},

		getRouteForFilter: function( filter ) {
			var route;
			switch (filter) {
				case tobuymvc.AppConstants.FILTER_ALL:
					route = '/';
					break;

				case tobuymvc.AppConstants.FILTER_ACTIVE:
					route = '/active';
					break;

				case tobuymvc.AppConstants.FILTER_COMPLETED:
					route = '/completed';
					break;
			}
			return route;
		},

		// route handlers
		handleFilterAll: function () {
			this.resource.facade.sendNotification( tobuymvc.AppConstants.FILTER_TODOS, tobuymvc.AppConstants.FILTER_ALL );
		},

		handleFilterActive: function () {
			this.resource.facade.sendNotification( tobuymvc.AppConstants.FILTER_TODOS, tobuymvc.AppConstants.FILTER_ACTIVE );
		},

		handleFilterCompleted: function () {
			this.resource.facade.sendNotification( tobuymvc.AppConstants.FILTER_TODOS, tobuymvc.AppConstants.FILTER_COMPLETED );
		},

	 },

	 // STATIC MEMBERS
	 {
		 NAME: 'RoutesMediator'
	 }
);
