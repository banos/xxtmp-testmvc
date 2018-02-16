/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

import { Utils } from "./utils";

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class TodoModel implements ITodoModel {

  public key : string;
  public tobuys : Array<ITodo>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.tobuys = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.tobuys);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addTodo(title : string) {
    this.tobuys = this.tobuys.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });

    this.inform();
  }

  public toggleAll(checked : Boolean) {
    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or tobuy items themselves.
    this.tobuys = this.tobuys.map<ITodo>((tobuy : ITodo) => {
      return Utils.extend({}, tobuy, {completed: checked});
    });

    this.inform();
  }

  public toggle(tobuyToToggle : ITodo) {
    this.tobuys = this.tobuys.map<ITodo>((tobuy : ITodo) => {
      return tobuy !== tobuyToToggle ?
        tobuy :
        Utils.extend({}, tobuy, {completed: !tobuy.completed});
    });

    this.inform();
  }

  public destroy(tobuy : ITodo) {
    this.tobuys = this.tobuys.filter(function (candidate) {
      return candidate !== tobuy;
    });

    this.inform();
  }

  public save(tobuyToSave : ITodo, text : string) {
    this.tobuys = this.tobuys.map(function (tobuy) {
      return tobuy !== tobuyToSave ? tobuy : Utils.extend({}, tobuy, {title: text});
    });

    this.inform();
  }

  public clearCompleted() {
    this.tobuys = this.tobuys.filter(function (tobuy) {
      return !tobuy.completed;
    });

    this.inform();
  }
}

export { TodoModel };
