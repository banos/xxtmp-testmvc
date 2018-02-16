/// <reference path='_all.ts' />

/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
module tobuys {
    'use strict';

    var tobuymvc = angular.module('tobuymvc', [])
            .controller('tobuyCtrl', TodoCtrl)
            .directive('tobuyBlur', tobuyBlur)
            .directive('tobuyFocus', tobuyFocus)
            .directive('tobuyEscape', tobuyEscape)
            .service('tobuyStorage', TodoStorage);
}
