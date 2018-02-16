/// <reference path='../_all.ts' />
var tobuys;
(function (tobuys) {
    'use strict';
    var TobuyItem = (function () {
        function TobuyItem(title, completed) {
            this.title = title;
            this.completed = completed;
        }
        return TobuyItem;
    })();
    tobuys.TobuyItem = TobuyItem;
})(tobuys || (tobuys = {}));
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
var tobuys;
(function (tobuys) {
    'use strict';
    /**
     * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
     */
    function tobuyFocus($timeout) {
        return {
            link: function ($scope, element, attributes) {
                $scope.$watch(attributes.tobuyFocus, function (newval) {
                    if (newval) {
                        $timeout(function () { return element[0].focus(); }, 0, false);
                    }
                });
            }
        };
    }
    tobuys.tobuyFocus = tobuyFocus;
    tobuyFocus.$inject = ['$timeout'];
})(tobuys || (tobuys = {}));
/// <reference path='../_all.ts' />
var tobuys;
(function (tobuys) {
    'use strict';
    /**
     * Directive that executes an expression when the element it is applied to loses focus.
     */
    function tobuyBlur() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('blur', function () { $scope.$apply(attributes.tobuyBlur); });
                $scope.$on('$destroy', function () { element.unbind('blur'); });
            }
        };
    }
    tobuys.tobuyBlur = tobuyBlur;
})(tobuys || (tobuys = {}));
/// <reference path='../_all.ts' />
var tobuys;
(function (tobuys) {
    'use strict';
    var ESCAPE_KEY = 27;
    /**
     * Directive that cancels editing a tobuy if the user presses the Esc key.
     */
    function tobuyEscape() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('keydown', function (event) {
                    if (event.keyCode === ESCAPE_KEY) {
                        $scope.$apply(attributes.tobuyEscape);
                    }
                });
                $scope.$on('$destroy', function () { element.unbind('keydown'); });
            }
        };
    }
    tobuys.tobuyEscape = tobuyEscape;
})(tobuys || (tobuys = {}));
/// <reference path='../_all.ts' />
var tobuys;
(function (tobuys_1) {
    'use strict';
    /**
     * Services that persists and retrieves TOBUYs from localStorage.
     */
    var TobuyStorage = (function () {
        function TobuyStorage() {
            this.STORAGE_ID = 'tobuys-angularjs-typescript';
        }
        TobuyStorage.prototype.get = function () {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        };
        TobuyStorage.prototype.put = function (tobuys) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(tobuys));
        };
        return TobuyStorage;
    })();
    tobuys_1.TobuyStorage = TobuyStorage;
})(tobuys || (tobuys = {}));
/// <reference path='../_all.ts' />
var tobuys;
(function (tobuys) {
    'use strict';
    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the tobuyStorage service
     * - exposes the model to the template and provides event handlers
     */
    var TobuyCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function TobuyCtrl($scope, $location, tobuyStorage, filterFilter) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.tobuyStorage = tobuyStorage;
            this.filterFilter = filterFilter;
            this.tobuys = $scope.tobuys = tobuyStorage.get();
            $scope.newTobuy = '';
            $scope.editedTobuy = null;
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            $scope.$watch('tobuys', function () { return _this.onTobuys(); }, true);
            $scope.$watch('location.path()', function (path) { return _this.onPath(path); });
            if ($location.path() === '')
                $location.path('/');
            $scope.location = $location;
        }
        TobuyCtrl.prototype.onPath = function (path) {
            this.$scope.statusFilter = (path === '/active') ?
                { completed: false } : (path === '/completed') ?
                { completed: true } : {};
        };
        TobuyCtrl.prototype.onTobuys = function () {
            this.$scope.remainingCount = this.filterFilter(this.tobuys, { completed: false }).length;
            this.$scope.doneCount = this.tobuys.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount;
            this.tobuyStorage.put(this.tobuys);
        };
        TobuyCtrl.prototype.addTobuy = function () {
            var newTobuy = this.$scope.newTobuy.trim();
            if (!newTobuy.length) {
                return;
            }
            this.tobuys.push(new tobuys.TobuyItem(newTobuy, false));
            this.$scope.newTobuy = '';
        };
        TobuyCtrl.prototype.editTobuy = function (tobuyItem) {
            this.$scope.editedTobuy = tobuyItem;
            // Clone the original tobuy in case editing is cancelled.
            this.$scope.originalTobuy = angular.extend({}, tobuyItem);
        };
        TobuyCtrl.prototype.revertEdits = function (tobuyItem) {
            this.tobuys[this.tobuys.indexOf(tobuyItem)] = this.$scope.originalTobuy;
            this.$scope.reverted = true;
        };
        TobuyCtrl.prototype.doneEditing = function (tobuyItem) {
            this.$scope.editedTobuy = null;
            this.$scope.originalTobuy = null;
            if (this.$scope.reverted) {
                // Tobuy edits were reverted, don't save.
                this.$scope.reverted = null;
                return;
            }
            tobuyItem.title = tobuyItem.title.trim();
            if (!tobuyItem.title) {
                this.removeTobuy(tobuyItem);
            }
        };
        TobuyCtrl.prototype.removeTobuy = function (tobuyItem) {
            this.tobuys.splice(this.tobuys.indexOf(tobuyItem), 1);
        };
        TobuyCtrl.prototype.clearDoneTobuys = function () {
            this.$scope.tobuys = this.tobuys = this.tobuys.filter(function (tobuyItem) { return !tobuyItem.completed; });
        };
        TobuyCtrl.prototype.markAll = function (completed) {
            this.tobuys.forEach(function (tobuyItem) { tobuyItem.completed = completed; });
        };
        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        TobuyCtrl.$inject = [
            '$scope',
            '$location',
            'tobuyStorage',
            'filterFilter'
        ];
        return TobuyCtrl;
    })();
    tobuys.TobuyCtrl = TobuyCtrl;
})(tobuys || (tobuys = {}));
/// <reference path='_all.ts' />
/**
 * The main TobuyMVC app module.
 *
 * @type {angular.Module}
 */
var tobuys;
(function (tobuys) {
    'use strict';
    var tobuymvc = angular.module('tobuymvc', [])
        .controller('tobuyCtrl', tobuys.TobuyCtrl)
        .directive('tobuyBlur', tobuys.tobuyBlur)
        .directive('tobuyFocus', tobuys.tobuyFocus)
        .directive('tobuyEscape', tobuys.tobuyEscape)
        .service('tobuyStorage', tobuys.TobuyStorage);
})(tobuys || (tobuys = {}));
/// <reference path='libs/jquery/jquery.d.ts' />
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path='models/TobuyItem.ts' />
/// <reference path='interfaces/ITobuyScope.ts' />
/// <reference path='interfaces/ITobuyStorage.ts' />
/// <reference path='directives/TobuyFocus.ts' />
/// <reference path='directives/TobuyBlur.ts' />
/// <reference path='directives/TobuyEscape.ts' />
/// <reference path='services/TobuyStorage.ts' />
/// <reference path='controllers/TobuyCtrl.ts' />
/// <reference path='Application.ts' />
//# sourceMappingURL=Application.js.map