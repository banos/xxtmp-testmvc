var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var store_1 = require('./services/store');
var TodoApp = (function () {
    function TodoApp(tobuyStore) {
        this.newTodoText = '';
        this.tobuyStore = tobuyStore;
    }
    TodoApp.prototype.stopEditing = function (tobuy, editedTitle) {
        tobuy.title = editedTitle;
        tobuy.editing = false;
    };
    TodoApp.prototype.cancelEditingTodo = function (tobuy) {
        tobuy.editing = false;
    };
    TodoApp.prototype.updateEditingTodo = function (tobuy, editedTitle) {
        editedTitle = editedTitle.trim();
        tobuy.editing = false;
        if (editedTitle.length === 0) {
            return this.tobuyStore.remove(tobuy);
        }
        tobuy.title = editedTitle;
    };
    TodoApp.prototype.editTodo = function (tobuy) {
        tobuy.editing = true;
    };
    TodoApp.prototype.removeCompleted = function () {
        this.tobuyStore.removeCompleted();
    };
    TodoApp.prototype.toggleCompletion = function (tobuy) {
        this.tobuyStore.toggleCompletion(tobuy);
    };
    TodoApp.prototype.remove = function (tobuy) {
        this.tobuyStore.remove(tobuy);
    };
    TodoApp.prototype.addTodo = function () {
        if (this.newTodoText.trim().length) {
            this.tobuyStore.add(this.newTodoText);
            this.newTodoText = '';
        }
    };
    TodoApp = __decorate([
        core_1.Component({
            selector: 'tobuy-app',
            templateUrl: 'app/app.html'
        }), 
        __metadata('design:paramtypes', [store_1.TodoStore])
    ], TodoApp);
    return TodoApp;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodoApp;
//# sourceMappingURL=app.js.map