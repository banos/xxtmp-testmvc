/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

declare var Router;

import { TodoModel } from "./tobuyModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./tobuyItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event : __React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = React.findDOMNode<HTMLInputElement>(this.refs["newField"]).value.trim();

    if (val) {
      this.props.model.addTodo(val);
      React.findDOMNode<HTMLInputElement>(this.refs["newField"]).value = '';
    }
  }

  public toggleAll(event : __React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(tobuyToToggle : ITodo) {
    this.props.model.toggle(tobuyToToggle);
  }

  public destroy(tobuy : ITodo) {
    this.props.model.destroy(tobuy);
  }

  public edit(tobuy : ITodo) {
    this.setState({editing: tobuy.id});
  }

  public save(tobuyToSave : ITodo, text : String) {
    this.props.model.save(tobuyToSave, text);
    this.setState({editing: null});
  }

  public cancel() {
    this.setState({editing: null});
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public render() {
    var footer;
    var main;
    const tobuys = this.props.model.tobuys;

    var shownTodos = tobuys.filter((tobuy) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !tobuy.completed;
      case COMPLETED_TODOS:
        return tobuy.completed;
      default:
        return true;
      }
    });

    var tobuyItems = shownTodos.map((tobuy) => {
      return (
        <TodoItem
          key={tobuy.id}
          tobuy={tobuy}
          onToggle={this.toggle.bind(this, tobuy)}
          onDestroy={this.destroy.bind(this, tobuy)}
          onEdit={this.edit.bind(this, tobuy)}
          editing={this.state.editing === tobuy.id}
          onSave={this.save.bind(this, tobuy)}
          onCancel={ e => this.cancel() }
        />
      );
    });

    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or tobuy items themselves.
    var activeTodoCount = tobuys.reduce(function (accum, tobuy) {
      return tobuy.completed ? accum : accum + 1;
    }, 0);

    var completedCount = tobuys.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={ e=> this.clearCompleted() }
        />;
    }

    if (tobuys.length) {
      main = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeTodoCount === 0}
          />
          <ul className="tobuy-list">
            {tobuyItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>tobuys</h1>
          <input
            ref="newField"
            className="new-tobuy"
            placeholder="What needs to be done?"
            onKeyDown={ e => this.handleNewTodoKeyDown(e) }
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

var model = new TodoModel('react-tobuys');

function render() {
  React.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName('tobuyapp')[0]
  );
}

model.subscribe(render);
render();
