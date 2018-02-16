/*global tobuymvc */
'use strict';

/**
 * Directive that executes an expression when the element it is applied to loses focus
 */
tobuymvc.directive('tobuyBlur', function () {
	return function (scope, elem, attrs) {
		elem.bind('blur', function () {
			scope.$apply(attrs.tobuyBlur);
		});

		scope.$on('$destroy', function () {
			elem.unbind('blur');
		});
	};
});
