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
					self.system.notify( 'TobuyListView:removeAllDoneTobuys' );
				});

			},
			render: function() {
				this.renderCounts( this.tobuysModel.getNumTotal(), this.tobuysModel.getNumActive() );
			},
			renderCounts: function( numTobuysTotal, numTobuysActive ) {
				var numTobuysCompleted = numTobuysTotal - numTobuysActive,
					countTitle = '<strong>' + numTobuysActive + '</strong> ' + this.pluralizeUtil.pluralize( numTobuysActive, 'item' ) + ' left';

				// Only show the footer when there are at least one tobuy.
				$footer.toggle( !!numTobuysTotal );

				// Toggle clear button
				$clearBtn.toggle( !!numTobuysCompleted );
			}
		};
	};

}( dijondemo ));
