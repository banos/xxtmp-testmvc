(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var utils_1 = require("./utils");
var TobuyModel = (function () {
    function TobuyModel(key) {
        this.key = key;
        this.tobuys = utils_1.Utils.store(key);
        this.onChanges = [];
    }
    TobuyModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    TobuyModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, this.tobuys);
        this.onChanges.forEach(function (cb) { cb(); });
    };
    TobuyModel.prototype.addTobuy = function (title) {
        this.tobuys = this.tobuys.concat({
            id: utils_1.Utils.uuid(),
            title: title,
            completed: false
        });
        this.inform();
    };
    TobuyModel.prototype.toggleAll = function (checked) {
        this.tobuys = this.tobuys.map(function (tobuy) {
            return utils_1.Utils.extend({}, tobuy, { completed: checked });
        });
        this.inform();
    };
    TobuyModel.prototype.toggle = function (tobuyToToggle) {
        this.tobuys = this.tobuys.map(function (tobuy) {
            return tobuy !== tobuyToToggle ?
                tobuy :
                utils_1.Utils.extend({}, tobuy, { completed: !tobuy.completed });
        });
        this.inform();
    };
    TobuyModel.prototype.destroy = function (tobuy) {
        this.tobuys = this.tobuys.filter(function (candidate) {
            return candidate !== tobuy;
        });
        this.inform();
    };
    TobuyModel.prototype.save = function (tobuyToSave, text) {
        this.tobuys = this.tobuys.map(function (tobuy) {
            return tobuy !== tobuyToSave ? tobuy : utils_1.Utils.extend({}, tobuy, { title: text });
        });
        this.inform();
    };
    TobuyModel.prototype.clearCompleted = function () {
        this.tobuys = this.tobuys.filter(function (tobuy) {
            return !tobuy.completed;
        });
        this.inform();
    };
    return TobuyModel;
})();
exports.TobuyModel = TobuyModel;

},{"./utils":6}],2:[function(require,module,exports){
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var TobuyModel_1 = require("./TobuyModel");
var footer_1 = require("./footer");
var tobuyItem_1 = require("./tobuyItem");
var constants_1 = require("./constants");
var TobuyApp = (function (_super) {
    __extends(TobuyApp, _super);
    function TobuyApp(props) {
        _super.call(this, props);
        this.state = {
            nowShowing: constants_1.ALL_TOBUYS,
            editing: null
        };
    }
    TobuyApp.prototype.componentDidMount = function () {
        var setState = this.setState;
        var router = Router({
            '/': setState.bind(this, { nowShowing: constants_1.ALL_TOBUYS }),
            '/active': setState.bind(this, { nowShowing: constants_1.ACTIVE_TOBUYS }),
            '/completed': setState.bind(this, { nowShowing: constants_1.COMPLETED_TOBUYS })
        });
        router.init('/');
    };
    TobuyApp.prototype.handleNewTobuyKeyDown = function (event) {
        if (event.keyCode !== constants_1.ENTER_KEY) {
            return;
        }
        event.preventDefault();
        var val = React.findDOMNode(this.refs["newField"]).value.trim();
        if (val) {
            this.props.model.addTobuy(val);
            React.findDOMNode(this.refs["newField"]).value = '';
        }
    };
    TobuyApp.prototype.toggleAll = function (event) {
        var target = event.target;
        var checked = target.checked;
        this.props.model.toggleAll(checked);
    };
    TobuyApp.prototype.toggle = function (tobuyToToggle) {
        this.props.model.toggle(tobuyToToggle);
    };
    TobuyApp.prototype.destroy = function (tobuy) {
        this.props.model.destroy(tobuy);
    };
    TobuyApp.prototype.edit = function (tobuy) {
        this.setState({ editing: tobuy.id });
    };
    TobuyApp.prototype.save = function (tobuyToSave, text) {
        this.props.model.save(tobuyToSave, text);
        this.setState({ editing: null });
    };
    TobuyApp.prototype.cancel = function () {
        this.setState({ editing: null });
    };
    TobuyApp.prototype.clearCompleted = function () {
        this.props.model.clearCompleted();
    };
    TobuyApp.prototype.render = function () {
        var _this = this;
        var footer;
        var main;
        var tobuys = this.props.model.tobuys;
        var shownTobuys = tobuys.filter(function (tobuy) {
            switch (_this.state.nowShowing) {
                case constants_1.ACTIVE_TOBUYS:
                    return !tobuy.completed;
                case constants_1.COMPLETED_TOBUYS:
                    return tobuy.completed;
                default:
                    return true;
            }
        });
        var tobuyItems = shownTobuys.map(function (tobuy) {
            return (React.createElement(tobuyItem_1.TobuyItem, {"key": tobuy.id, "tobuy": tobuy, "onToggle": _this.toggle.bind(_this, tobuy), "onDestroy": _this.destroy.bind(_this, tobuy), "onEdit": _this.edit.bind(_this, tobuy), "editing": _this.state.editing === tobuy.id, "onSave": _this.save.bind(_this, tobuy), "onCancel": function (e) { return _this.cancel(); }}));
        });
        var activeTobuyCount = tobuys.reduce(function (accum, tobuy) {
            return tobuy.completed ? accum : accum + 1;
        }, 0);
        var completedCount = tobuys.length - activeTobuyCount;
        if (activeTobuyCount || completedCount) {
            footer =
                React.createElement(footer_1.TobuyFooter, {"count": activeTobuyCount, "completedCount": completedCount, "nowShowing": this.state.nowShowing, "onClearCompleted": function (e) { return _this.clearCompleted(); }});
        }
        if (tobuys.length) {
            main = (React.createElement("section", {"className": "main"}, React.createElement("input", {"className": "toggle-all", "type": "checkbox", "onChange": function (e) { return _this.toggleAll(e); }, "checked": activeTobuyCount === 0}), React.createElement("ul", {"className": "tobuy-list"}, tobuyItems)));
        }
        return (React.createElement("div", null, React.createElement("header", {"className": "header"}, React.createElement("h1", null, "tobuys"), React.createElement("input", {"ref": "newField", "className": "new-tobuy", "placeholder": "What needs to be done?", "onKeyDown": function (e) { return _this.handleNewTobuyKeyDown(e); }, "autoFocus": true})), main, footer));
    };
    return TobuyApp;
})(React.Component);
var model = new TobuyModel_1.TobuyModel('react-tobuys');
function render() {
    React.render(React.createElement(TobuyApp, {"model": model}), document.getElementsByClassName('tobuyapp')[0]);
}
model.subscribe(render);
render();

},{"./TobuyModel":1,"./constants":3,"./footer":4,"./tobuyItem":5}],3:[function(require,module,exports){
var ALL_TOBUYS = 'all';
exports.ALL_TOBUYS = ALL_TOBUYS;
var ACTIVE_TOBUYS = 'active';
exports.ACTIVE_TOBUYS = ACTIVE_TOBUYS;
var COMPLETED_TOBUYS = 'completed';
exports.COMPLETED_TOBUYS = COMPLETED_TOBUYS;
var ENTER_KEY = 13;
exports.ENTER_KEY = ENTER_KEY;
var ESCAPE_KEY = 27;
exports.ESCAPE_KEY = ESCAPE_KEY;

},{}],4:[function(require,module,exports){
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var TobuyFooter = (function (_super) {
    __extends(TobuyFooter, _super);
    function TobuyFooter() {
        _super.apply(this, arguments);
    }
    TobuyFooter.prototype.render = function () {
        var activeTobuyWord = utils_1.Utils.pluralize(this.props.count, 'item');
        var clearButton = null;
        if (this.props.completedCount > 0) {
            clearButton = (React.createElement("button", {"className": "clear-completed", "onClick": this.props.onClearCompleted}, "Clear completed"));
        }
        var nowShowing = this.props.nowShowing;
        return (React.createElement("footer", {"className": "footer"}, React.createElement("span", {"className": "tobuy-count"}, React.createElement("strong", null, this.props.count), " ", activeTobuyWord, " left"), React.createElement("ul", {"className": "filters"}, React.createElement("li", null, React.createElement("a", {"href": "#/", "className": classNames({ selected: nowShowing === constants_1.ALL_TOBUYS })}, "All")), ' ', React.createElement("li", null, React.createElement("a", {"href": "#/active", "className": classNames({ selected: nowShowing === constants_1.ACTIVE_TOBUYS })}, "Active")), ' ', React.createElement("li", null, React.createElement("a", {"href": "#/completed", "className": classNames({ selected: nowShowing === constants_1.COMPLETED_TOBUYS })}, "Completed"))), clearButton));
    };
    return TobuyFooter;
})(React.Component);
exports.TobuyFooter = TobuyFooter;

},{"./constants":3,"./utils":6}],5:[function(require,module,exports){
/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var constants_1 = require("./constants");
var TobuyItem = (function (_super) {
    __extends(TobuyItem, _super);
    function TobuyItem(props) {
        _super.call(this, props);
        this.state = { editText: this.props.tobuy.title };
    }
    TobuyItem.prototype.handleSubmit = function (event) {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            this.setState({ editText: val });
        }
        else {
            this.props.onDestroy();
        }
    };
    TobuyItem.prototype.handleEdit = function () {
        this.props.onEdit();
        this.setState({ editText: this.props.tobuy.title });
    };
    TobuyItem.prototype.handleKeyDown = function (event) {
        if (event.keyCode === constants_1.ESCAPE_KEY) {
            this.setState({ editText: this.props.tobuy.title });
            this.props.onCancel(event);
        }
        else if (event.keyCode === constants_1.ENTER_KEY) {
            this.handleSubmit(event);
        }
    };
    TobuyItem.prototype.handleChange = function (event) {
        var input = event.target;
        this.setState({ editText: input.value });
    };
    TobuyItem.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return (nextProps.tobuy !== this.props.tobuy ||
            nextProps.editing !== this.props.editing ||
            nextState.editText !== this.state.editText);
    };
    TobuyItem.prototype.componentDidUpdate = function (prevProps) {
        if (!prevProps.editing && this.props.editing) {
            var node = React.findDOMNode(this.refs["editField"]);
            node.focus();
            node.setSelectionRange(node.value.length, node.value.length);
        }
    };
    TobuyItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("li", {"className": classNames({
            completed: this.props.tobuy.completed,
            editing: this.props.editing
        })}, React.createElement("div", {"className": "view"}, React.createElement("input", {"className": "toggle", "type": "checkbox", "checked": this.props.tobuy.completed, "onChange": this.props.onToggle}), React.createElement("label", {"onDoubleClick": function (e) { return _this.handleEdit(); }}, this.props.tobuy.title), React.createElement("button", {"className": "destroy", "onClick": this.props.onDestroy})), React.createElement("input", {"ref": "editField", "className": "edit", "value": this.state.editText, "onBlur": function (e) { return _this.handleSubmit(e); }, "onChange": function (e) { return _this.handleChange(e); }, "onKeyDown": function (e) { return _this.handleKeyDown(e); }})));
    };
    return TobuyItem;
})(React.Component);
exports.TobuyItem = TobuyItem;

},{"./constants":3}],6:[function(require,module,exports){
var Utils = (function () {
    function Utils() {
    }
    Utils.uuid = function () {
        var i, random;
        var uuid = '';
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }
        return uuid;
    };
    Utils.pluralize = function (count, word) {
        return count === 1 ? word : word + 's';
    };
    Utils.store = function (namespace, data) {
        if (data) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        }
        var store = localStorage.getItem(namespace);
        return (store && JSON.parse(store)) || [];
    };
    Utils.extend = function () {
        var objs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objs[_i - 0] = arguments[_i];
        }
        var newObj = {};
        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = obj[key];
                }
            }
        }
        return newObj;
    };
    return Utils;
})();
exports.Utils = Utils;

},{}]},{},[2]);
