var Tobuy = (function () {
    function Tobuy(title) {
        this.completed = false;
        this.editing = false;
        this.title = title.trim();
    }
    Object.defineProperty(Tobuy.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value.trim();
        },
        enumerable: true,
        configurable: true
    });
    return Tobuy;
})();
exports.Tobuy = Tobuy;
var TobuyStore = (function () {
    function TobuyStore() {
        var persistedTobuys = JSON.parse(localStorage.getItem('angular2-tobuys') || '[]');
        // Normalize back into classes
        this.tobuys = persistedTobuys.map(function (tobuy) {
            var ret = new Tobuy(tobuy._title);
            ret.completed = tobuy.completed;
            return ret;
        });
    }
    TobuyStore.prototype.updateStore = function () {
        localStorage.setItem('angular2-tobuys', JSON.stringify(this.tobuys));
    };
    TobuyStore.prototype.getWithCompleted = function (completed) {
        return this.tobuys.filter(function (tobuy) { return tobuy.completed === completed; });
    };
    TobuyStore.prototype.allCompleted = function () {
        return this.tobuys.length === this.getCompleted().length;
    };
    TobuyStore.prototype.setAllTo = function (completed) {
        this.tobuys.forEach(function (t) { return t.completed = completed; });
        this.updateStore();
    };
    TobuyStore.prototype.removeCompleted = function () {
        this.tobuys = this.getWithCompleted(false);
        this.updateStore();
    };
    TobuyStore.prototype.getRemaining = function () {
        return this.getWithCompleted(false);
    };
    TobuyStore.prototype.getCompleted = function () {
        return this.getWithCompleted(true);
    };
    TobuyStore.prototype.toggleCompletion = function (tobuy) {
        tobuy.completed = !tobuy.completed;
        this.updateStore();
    };
    TobuyStore.prototype.remove = function (tobuy) {
        this.tobuys.splice(this.tobuys.indexOf(tobuy), 1);
        this.updateStore();
    };
    TobuyStore.prototype.add = function (title) {
        this.tobuys.push(new Tobuy(title));
        this.updateStore();
    };
    return TobuyStore;
})();
exports.TobuyStore = TobuyStore;
//# sourceMappingURL=store.js.map