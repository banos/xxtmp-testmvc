/// <reference path='../_all.ts' />
var tobuys;
(function (tobuys) {
    'use strict';
    var TodoItem = (function () {
        function TodoItem(title, completed) {
            this.title = title;
            this.completed = completed;
        }
        return TodoItem;
    })();
    tobuys.TodoItem = TodoItem;
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
     * Services that persists and retrieves TODOs from localStorage.
     */
    var TodoStorage = (function () {
        function TodoStorage() {
            this.STORAGE_ID = 'tobuys-angularjs-typescript';
        }
        TodoStorage.prototype.get = function () {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        };
        TodoStorage.prototype.put = function (tobuys) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(tobuys));
        };
        return TodoStorage;
    })();
    tobuys_1.TodoStorage = TodoStorage;
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
    var TodoCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function TodoCtrl($scope, $location, tobuyStorage, filterFilter) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.tobuyStorage = tobuyStorage;
            this.filterFilter = filterFilter;
            this.tobuys = $scope.tobuys = tobuyStorage.get();
            $scope.newTodo = '';
            $scope.editedTodo = null;
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            $scope.$watch('tobuys', function () { return _this.onTodos(); }, true);
            $scope.$watch('location.path()', function (path) { return _this.onPath(path); });
            if ($location.path() === '')
                $location.path('/');
            $scope.location = $location;
        }
        TodoCtrl.prototype.onPath = function (path) {
            this.$scope.statusFilter = (path === '/active') ?
                { completed: false } : (path === '/completed') ?
                { completed: true } : {};
        };
        TodoCtrl.prototype.onTodos = function () {
            this.$scope.remainingCount = this.filterFilter(this.tobuys, { completed: false }).length;
            this.$scope.doneCount = this.tobuys.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount;
            this.tobuyStorage.put(this.tobuys);
        };
        TodoCtrl.prototype.addTodo = function () {
            var newTodo = this.$scope.newTodo.trim();
            if (!newTodo.length) {
                return;
            }
            this.tobuys.push(new tobuys.TodoItem(newTodo, false));
            this.$scope.newTodo = '';
        };
        TodoCtrl.prototype.editTodo = function (tobuyItem) {
            this.$scope.editedTodo = tobuyItem;
            // Clone the original tobuy in case editing is cancelled.
            this.$scope.originalTodo = angular.extend({}, tobuyItem);
        };
        TodoCtrl.prototype.revertEdits = function (tobuyItem) {
            this.tobuys[this.tobuys.indexOf(tobuyItem)] = this.$scope.originalTodo;
            this.$scope.reverted = true;
        };
        TodoCtrl.prototype.doneEditing = function (tobuyItem) {
            this.$scope.editedTodo = null;
            this.$scope.originalTodo = null;
            if (this.$scope.reverted) {
                // Todo edits were reverted, don't save.
                this.$scope.reverted = null;
                return;
            }
            tobuyItem.title = tobuyItem.title.trim();
            if (!tobuyItem.title) {
                this.removeTodo(tobuyItem);
            }
        };
        TodoCtrl.prototype.removeTodo = function (tobuyItem) {
            this.tobuys.splice(this.tobuys.indexOf(tobuyItem), 1);
        };
        TodoCtrl.prototype.clearDoneTodos = function () {
            this.$scope.tobuys = this.tobuys = this.tobuys.filter(function (tobuyItem) { return !tobuyItem.completed; });
        };
        TodoCtrl.prototype.markAll = function (completed) {
            this.tobuys.forEach(function (tobuyItem) { tobuyItem.completed = completed; });
        };
        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        TodoCtrl.$inject = [
            '$scope',
            '$location',
            'tobuyStorage',
            'filterFilter'
        ];
        return TodoCtrl;
    })();
    tobuys.TodoCtrl = TodoCtrl;
})(tobuys || (tobuys = {}));
/// <reference path='_all.ts' />
/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
var tobuys;
(function (tobuys) {
    'use strict';
    var tobuymvc = angular.module('tobuymvc', [])
        .controller('tobuyCtrl', tobuys.TodoCtrl)
        .directive('tobuyBlur', tobuys.tobuyBlur)
        .directive('tobuyFocus', tobuys.tobuyFocus)
        .directive('tobuyEscape', tobuys.tobuyEscape)
        .service('tobuyStorage', tobuys.TodoStorage);
})(tobuys || (tobuys = {}));
/// <reference path='libs/jquery/jquery.d.ts' />
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path='models/TodoItem.ts' />
/// <reference path='interfaces/ITodoScope.ts' />
/// <reference path='interfaces/ITodoStorage.ts' />
/// <reference path='directives/TodoFocus.ts' />
/// <reference path='directives/TodoBlur.ts' />
/// <reference path='directives/TodoEscape.ts' />
/// <reference path='services/TodoStorage.ts' />
/// <reference path='controllers/TodoCtrl.ts' />
/// <reference path='Application.ts' />
//# sourceMappingURL=Application.js.map