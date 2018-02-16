/**
 * @author Mike Britton
 *
 * @class AppConstants
 * @link https://github.com/PureMVC/puremvc-js-demo-tobuymvc.git
 *
 * Define the core and notification constants.
 *
 * PureMVC JS is multi-core, meaning you may have multiple,
 * named and isolated PureMVC cores. This app only has one.
 */
puremvc.define({ name: 'tobuymvc.AppConstants' }, {}, {
	// The multiton key for this app's single core
	CORE_NAME:                'TobuyMVC',

	// Notifications
	STARTUP:                  'startup',
	ADD_TOBUY:                 'add_tobuy',
	DELETE_TOBUY:              'delete_tobuy',
	UPDATE_TOBUY:              'update_tobuy',
	TOGGLE_TOBUY_STATUS:       'toggle_tobuy_status',
	REMOVE_TOBUYS_COMPLETED:   'remove_tobuys_completed',
	FILTER_TOBUYS:             'filter_tobuys',
	TOBUYS_FILTERED:           'tobuys_filtered',

	// Filter routes
	FILTER_ALL:                'all',
	FILTER_ACTIVE:             'active',
	FILTER_COMPLETED:          'completed'
});
