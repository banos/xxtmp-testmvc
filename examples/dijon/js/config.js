/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 15:23
 */
var dijondemo = {};

(function( ns ) {
	'use strict';

	ns.views = {};
	ns.models = {};
	ns.controllers = {};
	ns.services = {};
	ns.utils = {};
	ns.Config = function() {
		return {
			system: undefined, //inject
			setup: function() {

				this.system.autoMapOutlets = true;

				// Values
				this.system.mapValue( 'enterKey', 13 );
				this.system.mapValue( 'uuidUtil', ns.utils.Utils );
				this.system.mapValue( 'pluralizeUtil', ns.utils.Utils );

				// Models
				this.system.mapSingleton( 'tobuysModel', ns.models.TobuysModel );

				// Services
				this.system.mapSingleton( 'storageService', ns.services.LocalStorageService );

				// Views
				this.system.mapSingleton( 'footerView', ns.views.FooterView );

				this.system.mapSingleton( 'formView', ns.views.TobuyFormView );

				this.system.mapSingleton( 'listView', ns.views.TobuyListView );

				//Handlers
				this.system.mapHandler( 'TobuyFormView:addTobuy', 'tobuysModel', 'add' );
				this.system.mapHandler( 'TobuyListView:toggleDoneOfTobuy', 'tobuysModel', 'toggleDone' );
				this.system.mapHandler( 'TobuyListView:setTitleOfTobuy', 'tobuysModel', 'setTitle' );
				this.system.mapHandler( 'TobuyListView:removeTobuy', 'tobuysModel', 'remove' );
				this.system.mapHandler( 'TobuyListView:setDoneForAllTobuys', 'tobuysModel', 'setDoneForAll' );
				this.system.mapHandler( 'TobuyListView:removeAllDoneTobuys', 'tobuysModel', 'removeAllDone' );
				this.system.mapHandler( 'StorageService:retrieveCompleted', 'tobuysModel', 'setList' );
				this.system.mapHandler( 'TobuysModel:tobuysListUpdated', 'listView', 'render' );
				this.system.mapHandler( 'TobuysModel:tobuysListUpdated', 'footerView', 'render' );
				this.system.mapHandler( 'TobuysModel:tobuysListUpdated', 'storageService', 'store' );
				this.system.mapHandler( 'App:startup', 'storageService', 'retrieve' );
				this.system.mapHandler( 'App:startupComplete', 'formView', 'render' );
				this.system.mapHandler( 'App:startupComplete', 'storageService', 'retrieve' );

			}
		};
	};

}( dijondemo ));
