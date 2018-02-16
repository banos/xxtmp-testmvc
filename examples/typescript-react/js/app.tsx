/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts"/>

declare var Router;

import { TobuyModel } from "./tobuyModel";
import { TobuyFooter } from "./footer";
import { TobuyItem } from "./tobuyItem";
import { ALL_TOBUYS, ACTIVE_TOBUYS, COMPLETED_TOBUYS, ENTER_KEY } from "./constants";

class TobuyApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TOBUYS,
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TOBUYS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TOBUYS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TOBUYS})
    });
    router.init('/');
  }

  public handleNewTobuyKeyDown(event : __React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = React.findDOMNode<HTMLInputElement>(this.refs["newField"]).value.trim();

    if (val) {
      this.props.model.addTobuy(val);
      React.findDOMNode<HTMLInputElement>(this.refs["newField"]).value = '';
    }
  }

  public toggleAll(event : __React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(tobuyToToggle : ITobuy) {
    this.props.model.toggle(tobuyToToggle);
  }

  public destroy(tobuy : ITobuy) {
    this.props.model.destroy(tobuy);
  }

  public edit(tobuy : ITobuy) {
    this.setState({editing: tobuy.id});
  }

  public save(tobuyToSave : ITobuy, text : String) {
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

    var shownTobuys = tobuys.filter((tobuy) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TOBUYS:
        return !tobuy.completed;
      case COMPLETED_TOBUYS:
        return tobuy.completed;
      default:
        return true;
      }
    });

    var tobuyItems = shownTobuys.map((tobuy) => {
      return (
        <TobuyItem
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
    var activeTobuyCount = tobuys.reduce(function (accum, tobuy) {
      return tobuy.completed ? accum : accum + 1;
    }, 0);

    var completedCount = tobuys.length - activeTobuyCount;

    if (activeTobuyCount || completedCount) {
      footer =
        <TobuyFooter
          count={activeTobuyCount}
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
            checked={activeTobuyCount === 0}
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
            onKeyDown={ e => this.handleNewTobuyKeyDown(e) }
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

var model = new TobuyModel('react-tobuys');

function render() {
  React.render(
    <TobuyApp model={model}/>,
    document.getElementsByClassName('tobuyapp')[0]
  );
}

model.subscribe(render);
render();
