/// <reference path='../_all.ts' />

module tobuys {
	'use strict';

	/**
	 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
	 */
	export function tobuyFocus($timeout: ng.ITimeoutService): ng.IDirective {
		return {
			link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
				$scope.$watch(attributes.tobuyFocus, newval => {
					if (newval) {
						$timeout(() => element[0].focus(), 0, false);
					}
				});
			}
		};
	}

	tobuyFocus.$inject = ['$timeout'];

}