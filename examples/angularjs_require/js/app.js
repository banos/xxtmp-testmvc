/*global require*/
'use strict';

require([
	'angular'
], function (angular) {
	require([
		'controllers/tobuy', 
		'directives/tobuyFocus', 
		'directives/tobuyEscape',
		'services/tobuyStorage'
	], function (tobuyCtrl, tobuyFocusDir, tobuyEscapeDir, tobuyStorageSrv) {
		angular
			.module('tobuymvc', [tobuyFocusDir, tobuyEscapeDir, tobuyStorageSrv])
			.controller('TobuyController', tobuyCtrl);
		angular.bootstrap(document, ['tobuymvc']);			
	});	
});
