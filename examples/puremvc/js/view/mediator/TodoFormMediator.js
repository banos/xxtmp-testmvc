/**
 * @author Mike Britton
 *
 * @class TodoFormMediator
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define({
		name: 'tobuymvc.view.mediator.TodoFormMediator',
		parent: puremvc.Mediator
	},

	// INSTANCE MEMBERS
	{
		// Notifications this mediator is interested in
		listNotificationInterests: function() {
			return [ tobuymvc.AppConstants.TODOS_FILTERED ];
		},

		// Code to be executed when the Mediator instance is registered with the View
		onRegister: function() {
			this.setViewComponent( new tobuymvc.view.component.TodoForm );
			this.viewComponent.addEventListener( tobuymvc.view.event.AppEvents.TOGGLE_COMPLETE, this );
			this.viewComponent.addEventListener( tobuymvc.view.event.AppEvents.TOGGLE_COMPLETE_ALL, this );
			this.viewComponent.addEventListener( tobuymvc.view.event.AppEvents.UPDATE_ITEM, this );
			this.viewComponent.addEventListener( tobuymvc.view.event.AppEvents.DELETE_ITEM, this );
			this.viewComponent.addEventListener( tobuymvc.view.event.AppEvents.ADD_ITEM, this );
			this.viewComponent.addEventListener( tobuymvc.view.event.AppEvents.CLEAR_COMPLETED, this );
		},

		// Handle events from the view component
		handleEvent: function ( event ) {
			switch( event.type ) {
				case tobuymvc.view.event.AppEvents.TOGGLE_COMPLETE_ALL:
					this.sendNotification( tobuymvc.AppConstants.TOGGLE_TODO_STATUS, event.doToggleComplete );
					break;

				case tobuymvc.view.event.AppEvents.DELETE_ITEM:
					this.sendNotification( tobuymvc.AppConstants.DELETE_TODO, event.tobuyId );
					break;

				case tobuymvc.view.event.AppEvents.ADD_ITEM:
					this.sendNotification( tobuymvc.AppConstants.ADD_TODO, event.tobuy );
					break;

				case tobuymvc.view.event.AppEvents.CLEAR_COMPLETED:
					this.sendNotification( tobuymvc.AppConstants.REMOVE_TODOS_COMPLETED );
					break;

				case tobuymvc.view.event.AppEvents.TOGGLE_COMPLETE:
				case tobuymvc.view.event.AppEvents.UPDATE_ITEM:
					this.sendNotification( tobuymvc.AppConstants.UPDATE_TODO, event.tobuy );
					break;
			 }

		},

		// Handle notifications from other PureMVC actors
		handleNotification: function( note ) {
			switch ( note.getName() ) {
				case tobuymvc.AppConstants.TODOS_FILTERED:
					this.viewComponent.setFilteredTodoList( note.getBody() );
					break;
			}
		},
	},

	// STATIC MEMBERS
	{
		NAME: 'TodoFormMediator'
	}
);
