package com.thoughtworks.tobuy

import com.thoughtworks.binding.{Binding, dom}
import com.thoughtworks.binding.Binding.{BindingSeq, Constants, Var, Vars}
import scala.scalajs.js.annotation.JSExport
import org.scalajs.dom.{Event, KeyboardEvent, window}
import org.scalajs.dom.ext.{KeyCode, LocalStorage}
import org.scalajs.dom.raw.{HTMLInputElement, Node}
import upickle.default.{read, write}

@JSExport object Main {

  /** @note [[Todo]] is not a case class because we want to distinguish two [[Todo]]s with the same content */
  final class Todo(val title: String, val completed: Boolean)
  object Todo {
    def apply(title: String, completed: Boolean) = new Todo(title, completed)
    def unapply(tobuy: Todo) = Option((tobuy.title, tobuy.completed))
  }

  final case class TodoList(text: String, hash: String, items: BindingSeq[Todo])

  object Models {
    val LocalStorageName = "tobuys-binding.scala"
    def load() = LocalStorage(LocalStorageName).toSeq.flatMap(read[Seq[Todo]])
    def save(tobuys: Seq[Todo]) = LocalStorage(LocalStorageName) = write(tobuys)

    val allTodos = Vars[Todo](load(): _*)

    @dom val autoSave: Binding[Unit] = save(allTodos.bind)
    autoSave.watch()

    val editingTodo = Var[Option[Todo]](None)

    val all = TodoList("All", "#/", allTodos)
    val active = TodoList("Active", "#/active", for {tobuy <- allTodos if !tobuy.completed} yield tobuy)
    val completed = TodoList("Completed", "#/completed", for {tobuy <- allTodos if tobuy.completed} yield tobuy)
    val tobuyLists = Seq(all, active, completed)

    def getCurrentTodoList = tobuyLists.find(_.hash == window.location.hash).getOrElse(all)
    val currentTodoList = Var(getCurrentTodoList)
    @dom val hashBinding: Binding[Unit] = window.location.hash = currentTodoList.bind.hash
    hashBinding.watch()
    window.onhashchange = { _: Event => currentTodoList := getCurrentTodoList }
  }
  import Models._

  @dom def header: Binding[Node] = {
    val keyDownHandler = { event: KeyboardEvent =>
      (event.currentTarget, event.keyCode) match {
        case (input: HTMLInputElement, KeyCode.Enter) =>
          input.value.trim match {
            case "" =>
            case title =>
              allTodos.get += Todo(title, completed = false)
              input.value = ""
          }
        case _ =>
      }
    }
    <header class="header">
      <h1>tobuys</h1>
      <input class="new-tobuy" autofocus={true} placeholder="What needs to be done?" onkeydown={keyDownHandler}/>
    </header>
  }

  @dom def tobuyListItem(tobuy: Todo): Binding[Node] = {
    // onblur is not only triggered by user interaction, but also triggered by programmatic DOM changes.
    // In order to suppress this behavior, we have to replace the onblur event listener to a dummy handler before programmatic DOM changes.
    val suppressOnBlur = Var(false)
    def submit = { event: Event =>
      suppressOnBlur := true
      editingTodo := None
      event.currentTarget.asInstanceOf[HTMLInputElement].value.trim match {
        case "" =>
          allTodos.get.remove(allTodos.get.indexOf(tobuy))
        case trimmedTitle =>
          allTodos.get(allTodos.get.indexOf(tobuy)) = Todo(trimmedTitle, tobuy.completed)
      }
    }
    def keyDownHandler = { event: KeyboardEvent =>
      event.keyCode match {
        case KeyCode.Escape =>
          suppressOnBlur := true
          editingTodo := None
        case KeyCode.Enter =>
          submit(event)
        case _ =>
      }
    }
    def ignoreEvent = { _: Event => }
    @dom def blurHandler: Binding[Event => Any] = if (suppressOnBlur.bind) ignoreEvent else submit
    val edit = <input class="edit" value={ tobuy.title } onblur={ blurHandler.bind } onkeydown={ keyDownHandler } />
    def toggleHandler = { event: Event =>
      allTodos.get(allTodos.get.indexOf(tobuy)) = Todo(tobuy.title, event.currentTarget.asInstanceOf[HTMLInputElement].checked)
    }
    <li class={s"${if (tobuy.completed) "completed" else ""} ${if (editingTodo.bind.contains(tobuy)) "editing" else ""}"}>
      <div class="view">
        <input class="toggle" type="checkbox" checked={tobuy.completed} onclick={toggleHandler}/>
        <label ondblclick={ _: Event => editingTodo := Some(tobuy); edit.focus() }>{ tobuy.title }</label>
        <button class="destroy" onclick={ _: Event => allTodos.get.remove(allTodos.get.indexOf(tobuy)) }></button>
      </div>
      { edit }
    </li>
  }

  @dom def mainSection: Binding[Node] = {
    def toggleAllClickHandler = { event: Event =>
      for ((tobuy, i) <- allTodos.get.zipWithIndex) {
        if (tobuy.completed != event.currentTarget.asInstanceOf[HTMLInputElement].checked) {
          allTodos.get(i) = Todo(tobuy.title, event.currentTarget.asInstanceOf[HTMLInputElement].checked)
        }
      }
    }
    <section class="main" style:display={if (allTodos.length.bind == 0) "none" else ""}>
      <input type="checkbox" class="toggle-all" checked={active.items.length.bind == 0} onclick={toggleAllClickHandler}/>
      <label for="toggle-all">Mark all as complete</label>
      <ul class="tobuy-list">{ for { tobuy <- currentTodoList.bind.items } yield tobuyListItem(tobuy).bind }</ul>
    </section>
  }

  @dom def footer: Binding[Node] = {
    def clearCompletedClickHandler = { _: Event =>
      allTodos.get --= (for { tobuy <- allTodos.get if tobuy.completed } yield tobuy)
    }
    <footer class="footer" style:display={if (allTodos.length.bind == 0) "none" else ""}>
      <span class="tobuy-count">
        <strong>{ active.items.length.bind.toString }</strong> { if (active.items.length.bind == 1) "item" else "items"} left
      </span>
      <ul class="filters">{
        for { tobuyList <- Constants(tobuyLists: _*) } yield {
          <li>
            <a href={ tobuyList.hash } class={ if (tobuyList == currentTodoList.bind) "selected" else "" }>{ tobuyList.text }</a>
          </li>
        }
      }</ul>
      <button class="clear-completed" onclick={clearCompletedClickHandler}
              style:visibility={if (completed.items.length.bind == 0) "hidden" else "visible"}>
        Clear completed
      </button>
    </footer>
  }

  @dom def tobuyapp: Binding[BindingSeq[Node]] = {
    <section class="tobuyapp">{ header.bind }{ mainSection.bind }{ footer.bind }</section>
    <footer class="info">
      <p>Double-click to edit a tobuy</p>
      <p>Written by <a href="https://github.com/atry">Yang Bo</a></p>
      <p>Part of <a href="http://tobuymvc.com">TodoMVC</a></p>
    </footer>
  }

  @JSExport def main(container: Node) = dom.render(container, tobuyapp)

}
