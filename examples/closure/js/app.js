goog.provide('tobuymvc');

goog.require('goog.History');
goog.require('goog.array');
goog.require('goog.dom.query');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('tobuymvc.model.ToDoItem');
goog.require('tobuymvc.model.ToDoItemStore');
goog.require('tobuymvc.view');
goog.require('tobuymvc.view.ClearCompletedControlRenderer');
goog.require('tobuymvc.view.ItemCountControlRenderer');
goog.require('tobuymvc.view.ToDoItemControl');
goog.require('tobuymvc.view.ToDoListContainer');

/**
 * @fileoverview The controller/business logic for the application.
 *
 * This file creates the interface and marshals changes from the interface
 * to the model and back.
 */

/**
 * @type {tobuymvc.model.ToDoItemStore}
 */
var itemStore = new tobuymvc.model.ToDoItemStore();
itemStore.listen(tobuymvc.model.ToDoItemStore.ChangeEventType, redraw);

/**
 * @type {tobuymvc.view.ToDoListContainer}
 */
var container = new tobuymvc.view.ToDoListContainer();
container.decorate(document.getElementById('tobuy-list'));

/**
 * @type {Element}
 */
var main = document.getElementById('main');

/**
 * @type {Element}
 */
var footer = document.getElementById('footer');

/**
 * @type {goog.ui.Control}
 */
var itemCountControl = new goog.ui.Control(null,
    tobuymvc.view.ItemCountControlRenderer.getInstance());
itemCountControl.render(footer);

/**
 * @type {goog.ui.Control}
 */
var clearCompletedControl = new goog.ui.Control(null,
    tobuymvc.view.ClearCompletedControlRenderer.getInstance());
clearCompletedControl.render(footer);

goog.events.listen(clearCompletedControl,
    goog.ui.Component.EventType.ACTION, function(e) {
    // go backwards to avoid collection modification problems
    goog.array.forEachRight(itemStore.getAll(), function(model) {
        if (model.isDone()) {
            itemStore.remove(model);
        }
    });
});

/**
 * @type {Element}
 */
var toggleAll = document.getElementById('toggle-all');
goog.events.listen(toggleAll, goog.events.EventType.CLICK, function(e) {
    /**
     * @type {boolean}
     */
    var state = toggleAll.checked;
    goog.array.forEach(itemStore.getAll(), function(model) {
        /**
         * @type {!tobuymvc.model.ToDoItem}
         */
        var updatedModel = new tobuymvc.model.ToDoItem(
                model.getNote(), state, model.getId());

        itemStore.addOrUpdate(updatedModel);
    });
});

/**
 * Enum for the three possible route values
 * @enum {!string}
 */
tobuymvc.Route = {
    ALL: '/',
    ACTIVE: '/active',
    COMPLETED: '/completed'
};

/**
 * @type {!tobuymvc.Route}
 */
var currentRoute = tobuymvc.Route.ALL;

/**
 * @type {!goog.History}
 */
var historyObj = new goog.History();
goog.events.listen(historyObj, goog.history.EventType.NAVIGATE,
        function(e) {
    // constrain the route to be one of the enum values
    switch (e.token) {
    case tobuymvc.Route.ALL:
    case tobuymvc.Route.ACTIVE:
    case tobuymvc.Route.COMPLETED:
        if (e.token !== currentRoute) {
            currentRoute = e.token;
            redraw();
        }
        break;
    default:
        historyObj.replaceToken(tobuymvc.Route.ALL);
        break;
    }
});

function redraw() {
    container.removeChildren(true);
    /**
     * @type {Array.<tobuymvc.model.ToDoItem>}
     */
    var items = itemStore.getAll();
    goog.array.forEach(items, function(item) {
        // filter based on current route
        if ((currentRoute === tobuymvc.Route.ACTIVE && item.isDone()) ||
                (currentRoute === tobuymvc.Route.COMPLETED && !item.isDone())) {
            return;
        }

        /**
         * @type {tobuymvc.view.ToDoItemControl}
         */
        var control = new tobuymvc.view.ToDoItemControl();

        control.setContent(item.getNote());
        control.setChecked(item.isDone());
        control.setModel(item);

        container.addChild(control, true);
    });

    var doneCount = /** @type {number} */
    (goog.array.reduce(items, function(count, model) {
        return model.isDone() ? count + 1 : count;
    }, 0));
    var remainingCount = items.length - (doneCount);
    toggleAll.checked = remainingCount === 0;
    itemCountControl.setContent(remainingCount.toString());
    clearCompletedControl.setVisible(doneCount > 0);
    goog.style.setElementShown(main, items.length > 0);
    goog.style.setElementShown(footer, items.length > 0);

    /**
     * @type {NodeList}
     */
    var routeLinks = document.querySelectorAll('#filters a');
    goog.array.forEach(routeLinks, function(link, i) {
        if ((currentRoute === tobuymvc.Route.ALL && i === 0) ||
                (currentRoute === tobuymvc.Route.ACTIVE && i === 1) ||
                (currentRoute === tobuymvc.Route.COMPLETED && i === 2)) {
            link.className = 'selected';
        } else {
            link.className = '';
        }
    });
}

goog.events.listen(container,
    tobuymvc.view.ToDoItemControl.EventType.EDIT, function(e) {
    /**
     * @type {tobuymvc.view.ToDoItemControl}
     */
    var control = e.target;

    /**
     * @type {tobuymvc.model.ToDoItem}
     */
    var originalModel = /**@type {tobuymvc.model.ToDoItem} */
        (control.getModel());

    /**
     * @type {!tobuymvc.model.ToDoItem}
     */
    var updatedModel = new tobuymvc.model.ToDoItem(
            /**@type {!string} */ (control.getContent()),
            /**@type {!boolean} */ (control.isChecked()),
            originalModel.getId());

    itemStore.addOrUpdate(updatedModel);
});

goog.events.listen(container,
    tobuymvc.view.ToDoItemControl.EventType.DESTROY, function(e) {
    /**
     * @type {tobuymvc.view.ToDoItemControl}
     */
    var control = e.target;

    /**
     * @type {tobuymvc.model.ToDoItem}
     */
    var model = /**@type {tobuymvc.model.ToDoItem} */ (control.getModel());
    if (model !== null) {
        itemStore.remove(model);
    }
});

/**
 * @type {Element}
 */
var newToDo = document.getElementById('new-tobuy');
goog.events.listen(newToDo, goog.events.EventType.KEYUP, function(e) {
    if (e.keyCode !== goog.events.KeyCodes.ENTER) {
        return;
    }
    // get the text
    var value = goog.string.trim(newToDo.value);
    if (value === '') {
        return;
    }
    // clear the input box
    newToDo.value = '';
    // create the item
    itemStore.addOrUpdate(new tobuymvc.model.ToDoItem(value));
});

itemStore.load();
historyObj.setEnabled(true);
