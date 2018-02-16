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
