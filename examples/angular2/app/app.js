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
var TobuyApp = (function () {
    function TobuyApp(tobuyStore) {
        this.newTobuyText = '';
        this.tobuyStore = tobuyStore;
    }
    TobuyApp.prototype.stopEditing = function (tobuy, editedTitle) {
        tobuy.title = editedTitle;
        tobuy.editing = false;
    };
    TobuyApp.prototype.cancelEditingTobuy = function (tobuy) {
        tobuy.editing = false;
    };
    TobuyApp.prototype.updateEditingTobuy = function (tobuy, editedTitle) {
        editedTitle = editedTitle.trim();
        tobuy.editing = false;
        if (editedTitle.length === 0) {
            return this.tobuyStore.remove(tobuy);
        }
        tobuy.title = editedTitle;
    };
    TobuyApp.prototype.editTobuy = function (tobuy) {
        tobuy.editing = true;
    };
    TobuyApp.prototype.removeCompleted = function () {
        this.tobuyStore.removeCompleted();
    };
    TobuyApp.prototype.toggleCompletion = function (tobuy) {
        this.tobuyStore.toggleCompletion(tobuy);
    };
    TobuyApp.prototype.remove = function (tobuy) {
        this.tobuyStore.remove(tobuy);
    };
    TobuyApp.prototype.addTobuy = function () {
        if (this.newTobuyText.trim().length) {
            this.tobuyStore.add(this.newTobuyText);
            this.newTobuyText = '';
        }
    };
    TobuyApp = __decorate([
        core_1.Component({
            selector: 'tobuy-app',
            templateUrl: 'app/app.html'
        }), 
        __metadata('design:paramtypes', [store_1.TobuyStore])
    ], TobuyApp);
    return TobuyApp;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TobuyApp;
//# sourceMappingURL=app.js.map