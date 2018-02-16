part of tobuymvc;

class TodoWidget {
  static const HtmlEscape htmlEscape = const HtmlEscape();

  TodoApp tobuyApp;
  Todo tobuy;
  Element element;
  InputElement toggleElement;

  TodoWidget(this.tobuyApp, this.tobuy);

  Element createElement() {
    element = new Element.html('''
			<li ${tobuy.completed ? 'class="completed"' : ''}>
			<div class='view'>
			<input class='toggle' type='checkbox' ${tobuy.completed ? 'checked' : ''}>
			<label class='tobuy-content'>${htmlEscape.convert(tobuy.title)}</label>
			<button class='destroy'></button>
			</div>
			<input class='edit' value='${htmlEscape.convert(tobuy.title)}'>
			</li>
		''');

    Element contentElement = element.querySelector('.tobuy-content');
    InputElement editElement = element.querySelector('.edit');

    toggleElement = element.querySelector('.toggle');

    toggleElement.onClick.listen((_) {
      toggle();
      tobuyApp.updateCounts();
      tobuyApp.save();
    });

    contentElement.onDoubleClick.listen((_) {
      element.classes.add('editing');
      editElement.selectionStart = tobuy.title.length;
      editElement.focus();
    });

    void removeTodo() {
      element.remove();
      tobuyApp.removeTodo(this);
      tobuyApp.updateFooterDisplay();
    }

    element.querySelector('.destroy').onClick.listen((_) {
      removeTodo();
      tobuyApp.save();
    });

    void doneEditing() {
      editElement.value = editElement.value.trim();
      tobuy.title = editElement.value;
      if (tobuy.title.isNotEmpty) {
        contentElement.text = tobuy.title;
        element.classes.remove('editing');
      } else {
        removeTodo();
      }
      tobuyApp.save();
    }

    void undoEditing() {
      element.classes.remove('editing');
      editElement.value = tobuy.title;
    }

    editElement
      ..onKeyDown.listen((KeyboardEvent e) {
        switch (e.keyCode) {
          case KeyCode.ENTER:
            doneEditing();
            break;
          case KeyCode.ESC:
            undoEditing();
            break;
        }
      })
      ..onBlur.listen((_) => doneEditing());

    return element;
  }

  void set visible(bool visible) {
    element.style.display = visible ? 'block' : 'none';
  }

  void toggle() {
    tobuy.completed = !tobuy.completed;
    toggleElement.checked = tobuy.completed;
    if (tobuy.completed) {
      element.classes.add('completed');
    } else {
      element.classes.remove('completed');
    }
  }
}
