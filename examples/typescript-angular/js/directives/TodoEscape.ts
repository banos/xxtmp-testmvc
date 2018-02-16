/// <reference path='../_all.ts' />

module tobuys {
	'use strict';

	const ESCAPE_KEY = 27;

	/**
	 * Directive that cancels editing a tobuy if the user presses the Esc key.
	 */
	export function tobuyEscape(): ng.IDirective {
		return {
			link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
				element.bind('keydown', (event) => {
					if (event.keyCode === ESCAPE_KEY) {
						$scope.$apply(attributes.tobuyEscape);
					}
				});

				$scope.$on('$destroy', () => { element.unbind('keydown'); });
			}
		};
	}
}
