/// <reference path='../_all.ts' />

module tobuys {
    'use strict';

    /**
     * Directive that executes an expression when the element it is applied to loses focus.
     */
    export function tobuyBlur(): ng.IDirective {
        return {
            link: ($scope: ng.IScope, element: JQuery, attributes: any) => {
                element.bind('blur', () => { $scope.$apply(attributes.tobuyBlur); });
                $scope.$on('$destroy', () => { element.unbind('blur'); });
            }
        };
    }
}
