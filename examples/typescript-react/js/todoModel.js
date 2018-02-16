/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var utils_1 = require("./utils");
var TodoModel = (function () {
    function TodoModel(key) {
        this.key = key;
        this.tobuys = utils_1.Utils.store(key);
        this.onChanges = [];
    }
    TodoModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    TodoModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, this.tobuys);
        this.onChanges.forEach(function (cb) { cb(); });
    };
    TodoModel.prototype.addTodo = function (title) {
        this.tobuys = this.tobuys.concat({
            id: utils_1.Utils.uuid(),
            title: title,
            completed: false
        });
        this.inform();
    };
    TodoModel.prototype.toggleAll = function (checked) {
        this.tobuys = this.tobuys.map(function (tobuy) {
            return utils_1.Utils.extend({}, tobuy, { completed: checked });
        });
        this.inform();
    };
    TodoModel.prototype.toggle = function (tobuyToToggle) {
        this.tobuys = this.tobuys.map(function (tobuy) {
            return tobuy !== tobuyToToggle ?
                tobuy :
                utils_1.Utils.extend({}, tobuy, { completed: !tobuy.completed });
        });
        this.inform();
    };
    TodoModel.prototype.destroy = function (tobuy) {
        this.tobuys = this.tobuys.filter(function (candidate) {
            return candidate !== tobuy;
        });
        this.inform();
    };
    TodoModel.prototype.save = function (tobuyToSave, text) {
        this.tobuys = this.tobuys.map(function (tobuy) {
            return tobuy !== tobuyToSave ? tobuy : utils_1.Utils.extend({}, tobuy, { title: text });
        });
        this.inform();
    };
    TodoModel.prototype.clearCompleted = function () {
        this.tobuys = this.tobuys.filter(function (tobuy) {
            return !tobuy.completed;
        });
        this.inform();
    };
    return TodoModel;
})();
exports.TodoModel = TodoModel;
