part of tobuymvc;

class TodoApp {
  List<TodoWidget> tobuyWidgets = new List<TodoWidget>();

  Element tobuyListElement = querySelector('.tobuy-list');
  Element mainElement = querySelector('.main');
  InputElement checkAllCheckboxElement = querySelector('.toggle-all');
  Element footerElement = querySelector('.footer');
  Element countElement = querySelector('.tobuy-count');
  Element clearCompletedElement = querySelector('.clear-completed');
  Element showAllElement = querySelector('.filters a[href="#/"]');
  Element showActiveElement = querySelector('.filters a[href="#/active"]');
  Element showCompletedElement =
      querySelector('.filters a[href="#/completed"]');

  TodoApp() {
    initLocalStorage();
    initElementEventListeners();

    window.onHashChange.listen((e) => updateFilter());

    updateFooterDisplay();
  }

  void initLocalStorage() {
    var jsonList = window.localStorage['tobuys-vanilladart'];
    if (jsonList != null) {
      try {
        List<Map> tobuys = JSON.decode(jsonList);
        tobuys.forEach((tobuy) => addTodo(new Todo.fromJson(tobuy)));
      } catch (e) {
        print('Could not load tobuys form local storage.');
      }
    }
  }

  void initElementEventListeners() {
    InputElement newTodoElement = querySelector('.new-tobuy');

    newTodoElement.onKeyDown.listen((KeyboardEvent e) {
      if (e.keyCode == KeyCode.ENTER) {
        var title = newTodoElement.value.trim();
        if (title.isNotEmpty) {
          addTodo(new Todo(uuid(), title));
          newTodoElement.value = '';
          updateFooterDisplay();
          save();
        }
      }
    });

    checkAllCheckboxElement.onClick.listen((e) {
      for (var tobuyWidget in tobuyWidgets) {
        if (tobuyWidget.tobuy.completed != checkAllCheckboxElement.checked) {
          tobuyWidget.toggle();
        }
      }
      updateCounts();
      save();
    });

    clearCompletedElement.onClick.listen((_) {
      var newList = new List<TodoWidget>();
      for (TodoWidget tobuyWidget in tobuyWidgets) {
        if (tobuyWidget.tobuy.completed) {
          tobuyWidget.element.remove();
        } else {
          newList.add(tobuyWidget);
        }
      }
      tobuyWidgets = newList;
      updateFooterDisplay();
      save();
    });
  }

  void addTodo(Todo tobuy) {
    var tobuyWidget = new TodoWidget(this, tobuy);
    tobuyWidgets.add(tobuyWidget);
    tobuyListElement.nodes.add(tobuyWidget.createElement());
  }

  void updateFooterDisplay() {
    var display = tobuyWidgets.length == 0 ? 'none' : 'block';
    checkAllCheckboxElement.style.display = display;
    mainElement.style.display = display;
    footerElement.style.display = display;
    updateCounts();
  }

  void updateCounts() {
    var complete = tobuyWidgets.where((w) => w.tobuy.completed).length;
    checkAllCheckboxElement.checked = (complete == tobuyWidgets.length);
    var left = tobuyWidgets.length - complete;
    countElement.innerHtml =
        '<strong>$left</strong> item${left != 1 ? 's' : ''} left';
    if (complete == 0) {
      clearCompletedElement.style.display = 'none';
    } else {
      clearCompletedElement.style.display = 'block';
    }
    updateFilter();
  }

  void removeTodo(TodoWidget tobuyWidget) {
    tobuyWidgets.removeAt(tobuyWidgets.indexOf(tobuyWidget));
  }

  void updateFilter() {
    switch (window.location.hash) {
      case '#/active':
        showActive();
        break;
      case '#/completed':
        showCompleted();
        break;
      default:
        showAll();
        return;
    }
  }

  void showAll() {
    setSelectedFilter(showAllElement);
    for (var tobuyWidget in tobuyWidgets) {
      tobuyWidget.visible = true;
    }
  }

  void showActive() {
    setSelectedFilter(showActiveElement);
    for (var tobuyWidget in tobuyWidgets) {
      tobuyWidget.visible = !tobuyWidget.tobuy.completed;
    }
  }

  void showCompleted() {
    setSelectedFilter(showCompletedElement);
    for (var tobuyWidget in tobuyWidgets) {
      tobuyWidget.visible = tobuyWidget.tobuy.completed;
    }
  }

  void setSelectedFilter(Element e) {
    showAllElement.classes.remove('selected');
    showActiveElement.classes.remove('selected');
    showCompletedElement.classes.remove('selected');
    e.classes.add('selected');
  }

  void save() {
    var tobuys = new List<Todo>();
    for (var tobuyWidget in tobuyWidgets) {
      tobuys.add(tobuyWidget.tobuy);
    }
    window.localStorage['tobuys-vanilladart'] = JSON.encode(tobuys);
  }
}
