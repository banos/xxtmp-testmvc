/*global dijondemo, $ */
/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 14:20
 */
(function( ns ) {
	'use strict';

	ns.views.FooterView = function() {
		var $count = $('#tobuy-count'),
			$clearBtn = $('#clear-completed'),
			$footer = $('#tobuyapp').find('footer');

		return {
			system: undefined, //inject
			pluralizeUtil: undefined, //inject,
			tobuysModel: undefined, //inject
			setup: function() {
				var self = this;
				$clearBtn.on( 'click', function() {
					self.system.notify( 'TodoListView:removeAllDoneTodos' );
				});

			},
			render: function() {
				this.renderCounts( this.tobuysModel.getNumTotal(), this.tobuysModel.getNumActive() );
			},
			renderCounts: function( numTodosTotal, numTodosActive ) {
				var numTodosCompleted = numTodosTotal - numTodosActive,
					countTitle = '<strong>' + numTodosActive + '</strong> ' + this.pluralizeUtil.pluralize( numTodosActive, 'item' ) + ' left';

				// Only show the footer when there are at least one tobuy.
				$footer.toggle( !!numTodosTotal );

				// Toggle clear button
				$clearBtn.toggle( !!numTodosCompleted );
			}
		};
	};

}( dijondemo ));
