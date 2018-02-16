/*global window, Router, tobuyList */
(function (window, Router, tobuyList) {
	'use strict';

	// We're using https://github.com/flatiron/director for routing

	var router = new Router({
		'/active': function () {
			tobuyList.set('currentFilter', 'active');
		},
		'/completed': function () {
			tobuyList.set('currentFilter', 'completed');
		}
	});

	router.configure({
		notfound: function () {
			window.location.hash = '';
			tobuyList.set('currentFilter', 'all');
		}
	});

	router.init();

})(window, Router, tobuyList);
