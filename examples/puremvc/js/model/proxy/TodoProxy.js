/**
 * @author Mike Britton, Cliff Hall
 *
 * @class TodoProxy
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 *
 */
puremvc.define({
		name: 'tobuymvc.model.proxy.TodoProxy',
		parent: puremvc.Proxy
	},

	// INSTANCE MEMBERS
	{
		tobuys: [],
		stats: {},
		filter: tobuymvc.AppConstants.FILTER_ALL,
		LOCAL_STORAGE: 'tobuys-puremvc',

		onRegister: function() {
			this.loadData();
		},

		loadData: function() {
			var storageObject;
			if ( !localStorage.getItem( this.LOCAL_STORAGE ) ) {
				this.saveData();
			}
			storageObject = JSON.parse( localStorage.getItem( this.LOCAL_STORAGE ) );
			this.tobuys = storageObject.tobuys;
			this.filter = storageObject.filter;
			this.computeStats();
		},

		saveData: function() {
			var storageObject = { tobuys:this.tobuys, filter:this.filter };
			localStorage.setItem( this.LOCAL_STORAGE, JSON.stringify( storageObject ) );
		},

		computeStats: function() {
			this.stats.totalTodo        = this.tobuys.length;
			this.stats.tobuyCompleted    = this.getCompletedCount();
			this.stats.tobuyLeft         = this.stats.totalTodo - this.stats.tobuyCompleted;
		},

		filterTodos: function ( filter ) {
			var i;
			this.filter = filter;
			this.saveData();

			i = this.tobuys.length,
				filtered = [];

			while ( i-- ) {
				if ( filter === tobuymvc.AppConstants.FILTER_ALL ) {
					filtered.push( this.tobuys[ i ] );
				} else if ( this.tobuys[i].completed === true && filter === tobuymvc.AppConstants.FILTER_COMPLETED ) {
					filtered.push( this.tobuys[ i ] );
				} else if ( this.tobuys[i].completed === false && filter === tobuymvc.AppConstants.FILTER_ACTIVE ) {
					filtered.push( this.tobuys[ i ] );
				}
			}

			this.sendNotification( tobuymvc.AppConstants.TODOS_FILTERED, { tobuys:filtered, stats:this.stats, filter:this.filter } );
		},

		tobuysModified: function() {
			this.computeStats();
			this.filterTodos( this.filter );
		},

		removeTodosCompleted: function() {
			var i = this.tobuys.length;
			while ( i-- ) {
				if ( this.tobuys[ i ].completed ) {
					this.tobuys.splice( i, 1 );
				}
			}
			this.tobuysModified();
		},

		deleteTodo: function( id ) {
			var i = this.tobuys.length;
			while ( i-- ) {
				if ( this.tobuys[i].id === id ) {
					this.tobuys.splice(i, 1);
				}
			}
			this.tobuysModified();
		},

		toggleCompleteStatus: function( status ) {
			var i = this.tobuys.length;
			while ( i-- ) {
				this.tobuys[ i ].completed = status;
			}
			this.tobuysModified();
		},

		updateTodo: function( tobuy ) {
			var i = this.tobuys.length;
			while ( i-- ) {
				if ( this.tobuys[ i ].id === tobuy.id ) {
					 this.tobuys[ i ].title = tobuy.title;
					 this.tobuys[ i ].completed = tobuy.completed;
				}
			}
			this.tobuysModified();
		},

		addTodo: function( newTodo ) {
			newTodo.id = this.getUuid();
			this.tobuys.unshift( newTodo );
			this.tobuysModified();
		},

		getCompletedCount: function() {
			var i = this.tobuys.length,
				completed = 0;

			while ( i-- ) {
				if ( this.tobuys[ i ].completed ) {
					completed++;
				}
			}
			return completed;
		},

		getUuid: function() {
			var i, random, uuid = '';

			for ( i = 0; i < 32; i++ ) {
				random = Math.random() * 16 | 0;
				if ( i === 8 || i === 12 || i === 16 || i === 20 ) {
					uuid += '-';
				}
				uuid += ( i === 12 ? 4 : (i === 16 ? ( random & 3 | 8 ) : random) ).toString( 16 );
			}
			return uuid;
		}
	},

	// CLASS MEMBERS
	{
		NAME: 'TodoProxy'
	}
);
