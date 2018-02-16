/*global dijondemo, $, Handlebars */
/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 13:39
 */
(function( ns ) {
	'use strict';

	ns.views.TodoListView = function() {
		var _template = Handlebars.compile( $('#tobuy-template').html() ),
			$toggleAll = $('#toggle-all'),
			$tobuyList = $('#tobuy-list'),
			$main = $('#main'),
			$count = $('#tobuy-count');
		return {
			system: undefined, //inject
			enterKey: undefined,
			tobuysModel: undefined, //inject
			setup: function() {
				var self = this;
				$tobuyList.on( 'change', '.toggle', function() {
					var id = $( this ).closest('li').data('id');
					self.system.notify( 'TodoListView:toggleDoneOfTodo', id );
				});
				$tobuyList.on( 'dblclick', 'label', function() {
					$( this ).closest('li').addClass('editing').find('.edit').focus();
				} );
				$tobuyList.on( 'keypress', '.edit', function( e ) {
					if ( e.which === self.enterKey ) {
						e.target.blur();
					}
				});
				$tobuyList.on( 'blur', '.edit', function() {
					var id = $( this ).closest('li').data('id'),
						val = $.trim( $( this ).removeClass('editing').val() );
					if ( val ){
						self.system.notify( 'TodoListView:setTitleOfTodo', id, val );
					} else {
						self.system.notify( 'TodoListView:removeTodo', id );
					}
				});
				$tobuyList.on( 'click', '.destroy', function() {
					var id = $( this ).closest('li').data('id');
					self.system.notify( 'TodoListView:removeTodo', id );
				});
				$toggleAll.on( 'change', function() {
					var isChecked = !!$( this ).prop('checked');
					self.system.notify( 'TodoListView:setDoneForAllTodos', isChecked );
				});
			},
			render: function() {
				var tobuyList = this.tobuysModel.getList();
				$tobuyList.html( _template( tobuyList ) );
				$main.toggle( !!tobuyList.length );
				$toggleAll.prop( 'checked', !this.tobuysModel.getNumActive() );
			}
		};
	};

}( dijondemo ));
