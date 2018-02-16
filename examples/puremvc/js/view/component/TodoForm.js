/**
 * @author Mike Britton, Cliff Hall
 *
 * @class TodoForm
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 */
puremvc.define({
		name: 'tobuymvc.view.component.TodoForm',
		constructor: function(event) {
			// data
			this.tobuys  = [];
			this.stats  = {};
			this.filter = '';

			// Fixed DOM elements managed by this view component
			this.tobuyApp           = document.querySelector( '#tobuyapp' );
			this.main               = this.tobuyApp.querySelector( '#main' );
			this.toggleAllCheckbox  = this.tobuyApp.querySelector( '#toggle-all' );
			this.newTodoField       = this.tobuyApp.querySelector( '#new-tobuy' );
			this.tobuyList           = this.tobuyApp.querySelector( '#tobuy-list' );
			this.footer             = this.tobuyApp.querySelector( '#footer' );
			this.tobuyCount          = this.tobuyApp.querySelector( '#tobuy-count' );
			this.clearButton        = this.tobuyApp.querySelector( '#clear-completed' );
			this.filters            = this.tobuyApp.querySelector( '#filters' );
			this.filterAll          = this.filters.querySelector( '#filterAll' );
			this.filterActive       = this.filters.querySelector( '#filterActive' );
			this.filterCompleted    = this.filters.querySelector( '#filterCompleted' );

			// Event listeners for fixed UI elements
			this.newTodoField.component = this;
			tobuymvc.view.event.AppEvents.addEventListener( this.newTodoField, 'keypress', function( event ) {
					if ( event.keyCode === this.component.ENTER_KEY && this.value ) {
						this.component.dispatchAddTodo( event );
					}
			});

			this.clearButton.component = this;
			tobuymvc.view.event.AppEvents.addEventListener( this.clearButton, 'click', function( event ) {
					this.component.dispatchClearCompleted( event );
			});


			this.toggleAllCheckbox.component = this;
			tobuymvc.view.event.AppEvents.addEventListener( this.toggleAllCheckbox, 'change', function( event ) {
					this.component.dispatchToggleCompleteAll( event.target.checked );
			});
		}
	},

	// INSTANCE MEMBERS
	{
			ENTER_KEY: 13,
			ESC_KEY: 27,

			addEventListener: function ( type, listener, useCapture ){
				tobuymvc.view.event.AppEvents.addEventListener ( this.tobuyApp, type, listener, useCapture );
			},

			createEvent: function( eventName ) {
			   return tobuymvc.view.event.AppEvents.createEvent( eventName );
			},

			dispatchEvent: function( event ) {
			   tobuymvc.view.event.AppEvents.dispatchEvent( this.tobuyApp, event );
			},

			abandonEditTodo: function( event ) {
				var tobuy, tobuyId, div, inputEditTodo;
				inputEditTodo = event.target;
				tobuyId = inputEditTodo.getAttribute( 'data-tobuy-id' )
				tobuy = this.getTodoById( tobuyId );
				inputEditTodo.value = tobuy.title;
				inputEditTodo.completed = tobuy.completed;
				div = document.getElementById( 'li_' + tobuyId );
				div.className = 'view';
				this.newTodoField.focus();
                        },

			dispatchToggleComplete: function( event ) {
			   var tobuy, toggleItemCompleteEvent;
			   tobuy = this.getTodoById( event.target.getAttribute( 'data-tobuy-id' ) );
			   tobuy.id = event.target.getAttribute( 'data-tobuy-id' );
			   tobuy.completed = event.target.checked;
			   toggleItemCompleteEvent = this.createEvent( tobuymvc.view.event.AppEvents.TOGGLE_COMPLETE );
			   toggleItemCompleteEvent.tobuy = tobuy;
			   this.dispatchEvent( toggleItemCompleteEvent );
			},

			dispatchToggleCompleteAll: function( checked ) {
				var toggleCompleteAllEvent = this.createEvent( tobuymvc.view.event.AppEvents.TOGGLE_COMPLETE_ALL );
				toggleCompleteAllEvent.doToggleComplete = checked;
				this.dispatchEvent( toggleCompleteAllEvent );
			},

			dispatchClearCompleted: function() {
				var clearCompleteEvent = this.createEvent( tobuymvc.view.event.AppEvents.CLEAR_COMPLETED );
				this.dispatchEvent( clearCompleteEvent );
			},

			dispatchDelete: function( id ) {
				var deleteItemEvent = this.createEvent( tobuymvc.view.event.AppEvents.DELETE_ITEM );
				deleteItemEvent.tobuyId = id;
				this.dispatchEvent( deleteItemEvent );
			},

			dispatchAddTodo: function( event ) {
				var addItemEvent, tobuy = {};
				tobuy.completed = false;
				tobuy.title = this.newTodoField.value.trim();
				if ( tobuy.title === '' ) return;
				addItemEvent = this.createEvent( tobuymvc.view.event.AppEvents.ADD_ITEM );
				addItemEvent.tobuy = tobuy;
				this.dispatchEvent( addItemEvent );
			},

			dispatchUpdateTodo: function(event) {
				var eventType, updateItemEvent, tobuy = {};
				tobuy.id = event.target.id.slice(6);
				tobuy.title = event.target.value.trim();
				tobuy.completed = event.target.completed;
				eventType = ( tobuy.title === "" ) ?
					tobuymvc.view.event.AppEvents.DELETE_ITEM : tobuymvc.view.event.AppEvents.UPDATE_ITEM;
				updateItemEvent = this.createEvent( eventType );
				updateItemEvent.tobuy = tobuy;
				updateItemEvent.tobuyId = tobuy.id;
				this.dispatchEvent( updateItemEvent );
			},

			setFilteredTodoList: function( data ) {
				var tobuy, checkbox, label, deleteLink, divDisplay,
					inputEditTodo, li, i, tobuyId, div, inputEditTodo;

				// Update instance data
				this.tobuys  = data.tobuys;
				this.stats  = data.stats;
				this.filter = data.filter;

				// Hide main section if no tobuys
				this.main.style.display = this.stats.totalTodo ? 'block' : 'none';

				// Create Todo list
				this.tobuyList.innerHTML = '';
				this.newTodoField.value = '';
				for ( i=0; i < this.tobuys.length; i++ ) {

					tobuy = this.tobuys[i];

					// Create checkbox
					checkbox = document.createElement( 'input' );
					checkbox.className = 'toggle';
					checkbox.setAttribute( 'data-tobuy-id', tobuy.id );
					checkbox.type = 'checkbox';
					checkbox.component = this;
					tobuymvc.view.event.AppEvents.addEventListener( checkbox, 'change', function( event ) {
						this.component.dispatchToggleComplete( event );
					});

					// Create div text
					label = document.createElement( 'label' );
					label.setAttribute( 'data-tobuy-id', tobuy.id );
					label.appendChild( document.createTextNode( tobuy.title ) );

					// Create delete button
					deleteLink = document.createElement( 'button' );
					deleteLink.className = 'destroy';
					deleteLink.setAttribute( 'data-tobuy-id', tobuy.id );
					deleteLink.component = this;
					tobuymvc.view.event.AppEvents.addEventListener( deleteLink, 'click', function( event ) {
						this.component.dispatchDelete( event.target.getAttribute( 'data-tobuy-id' ) );
					});

					// Create divDisplay
					divDisplay = document.createElement( 'div' );
					divDisplay.className = 'view';
					divDisplay.setAttribute( 'data-tobuy-id', tobuy.id );
					divDisplay.appendChild( checkbox );
					divDisplay.appendChild( label );
					divDisplay.appendChild( deleteLink );
					tobuymvc.view.event.AppEvents.addEventListener( divDisplay, 'dblclick', function() {
						tobuyId = this.getAttribute( 'data-tobuy-id' );
						div = document.getElementById( 'li_' + tobuyId );
						inputEditTodo = document.getElementById( 'input_' + tobuyId );
						inputEditTodo.setAttribute( 'data-tobuy-id', tobuyId );
						div.className = 'editing';
						inputEditTodo.focus();

					});

					// Create tobuy input
					inputEditTodo = document.createElement( 'input' );
					inputEditTodo.id = 'input_' + tobuy.id;
					inputEditTodo.className = 'edit';
					inputEditTodo.value = tobuy.title;
					inputEditTodo.completed = tobuy.completed;
					inputEditTodo.component = this;
					tobuymvc.view.event.AppEvents.addEventListener( inputEditTodo, 'keypress', function( event ) {
						if ( event.keyCode === this.component.ENTER_KEY ) {
							this.component.dispatchUpdateTodo( event );
						}
					});

					tobuymvc.view.event.AppEvents.addEventListener( inputEditTodo, 'keydown', function( event ) {
						if ( event.keyCode === this.component.ESC_KEY ) {
							this.component.abandonEditTodo( event );
						}
					});

					tobuymvc.view.event.AppEvents.addEventListener( inputEditTodo, 'blur', function( event ) {
						this.component.dispatchUpdateTodo( event );
					});

					// Create Todo ListItem and add to list
					li = document.createElement( 'li' );
					li.id = 'li_' + tobuy.id;
					li.appendChild( divDisplay );
					li.appendChild( inputEditTodo );
					if ( tobuy.completed ) {
						li.className += 'completed';
						checkbox.checked = true;
					}
					this.tobuyList.appendChild( li );
				}

				// Update UI
				this.footer.style.display = this.stats.totalTodo ? 'block' : 'none';
				this.updateToggleAllCheckbox();
				this.updateClearButton();
				this.updateTodoCount();
				this.updateFilter();

			},

			getTodoById: function( id ) {
			   var i;
				for ( i = 0; i < this.tobuys.length; i++ ) {
					if ( this.tobuys[ i ].id === id ) {
						return this.tobuys[i];
					}
				}
			},

			updateFilter: function() {
				this.filterAll.className        = ( this.filter === tobuymvc.AppConstants.FILTER_ALL ) ? 'selected' : '';
				this.filterActive.className     = ( this.filter === tobuymvc.AppConstants.FILTER_ACTIVE ) ? 'selected' : '';
				this.filterCompleted.className  = ( this.filter === tobuymvc.AppConstants.FILTER_COMPLETED ) ? 'selected' : '';

			},

			updateToggleAllCheckbox: function() {
				var i, checked = ( this.tobuys.length > 0 );
				for ( i = 0; i < this.tobuys.length; i++ ) {
					if ( this.tobuys[ i ].completed === false ) {
						checked = false;
						break;
					}
				}
				this.toggleAllCheckbox.checked = checked;
			},

			updateClearButton: function() {
				this.clearButton.style.display = ( this.stats.tobuyCompleted === 0 ) ? 'none' : 'block';
				this.clearButton.innerHTML = 'Clear completed';
			},

			updateTodoCount: function() {
				var number = document.createElement( 'strong' ),
					text   = ' ' + (this.stats.tobuyLeft === 1 ? 'item' : 'items' ) + ' left';
				number.innerHTML = this.stats.tobuyLeft;
				this.tobuyCount.innerHTML = null;
				this.tobuyCount.appendChild( number );
				this.tobuyCount.appendChild( document.createTextNode( text ) );
			}
	},

	// STATIC MEMBERS
	{
		NAME: 'TodoForm',
	}
);
