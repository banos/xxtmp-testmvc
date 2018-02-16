var Todo = (function () {
    function Todo(title) {
        this.completed = false;
        this.editing = false;
        this.title = title.trim();
    }
    Object.defineProperty(Todo.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value.trim();
        },
        enumerable: true,
        configurable: true
    });
    return Todo;
})();
exports.Todo = Todo;
var TodoStore = (function () {
    function TodoStore() {
        var persistedTodos = JSON.parse(localStorage.getItem('angular2-tobuys') || '[]');
        // Normalize back into classes
        this.tobuys = persistedTodos.map(function (tobuy) {
            var ret = new Todo(tobuy._title);
            ret.completed = tobuy.completed;
            return ret;
        });
    }
    TodoStore.prototype.updateStore = function () {
        localStorage.setItem('angular2-tobuys', JSON.stringify(this.tobuys));
    };
    TodoStore.prototype.getWithCompleted = function (completed) {
        return this.tobuys.filter(function (tobuy) { return tobuy.completed === completed; });
    };
    TodoStore.prototype.allCompleted = function () {
        return this.tobuys.length === this.getCompleted().length;
    };
    TodoStore.prototype.setAllTo = function (completed) {
        this.tobuys.forEach(function (t) { return t.completed = completed; });
        this.updateStore();
    };
    TodoStore.prototype.removeCompleted = function () {
        this.tobuys = this.getWithCompleted(false);
        this.updateStore();
    };
    TodoStore.prototype.getRemaining = function () {
        return this.getWithCompleted(false);
    };
    TodoStore.prototype.getCompleted = function () {
        return this.getWithCompleted(true);
    };
    TodoStore.prototype.toggleCompletion = function (tobuy) {
        tobuy.completed = !tobuy.completed;
        this.updateStore();
    };
    TodoStore.prototype.remove = function (tobuy) {
        this.tobuys.splice(this.tobuys.indexOf(tobuy), 1);
        this.updateStore();
    };
    TodoStore.prototype.add = function (title) {
        this.tobuys.push(new Todo(title));
        this.updateStore();
    };
    return TodoStore;
})();
exports.TodoStore = TodoStore;
//# sourceMappingURL=store.js.map