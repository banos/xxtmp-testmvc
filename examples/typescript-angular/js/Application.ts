/// <reference path='_all.ts' />

/**
 * The main TobuyMVC app module.
 *
 * @type {angular.Module}
 */
module tobuys {
    'use strict';

    var tobuymvc = angular.module('tobuymvc', [])
            .controller('tobuyCtrl', TobuyCtrl)
            .directive('tobuyBlur', tobuyBlur)
            .directive('tobuyFocus', tobuyFocus)
            .directive('tobuyEscape', tobuyEscape)
            .service('tobuyStorage', TobuyStorage);
}
