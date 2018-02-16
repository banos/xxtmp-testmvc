/*global tobuymvc */
'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
tobuymvc.directive('tobuyFocus', function tobuyFocus($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.tobuyFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});
