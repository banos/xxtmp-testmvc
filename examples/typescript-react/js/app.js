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
