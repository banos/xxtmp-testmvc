goog.provide('tobuymvc.view.ToDoItemControlRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.ControlRenderer');

/**
 * The renderer for the ToDoItemControl which has knowledge of the DOM
 * structure of the Control and the applicable CSS classes.
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
tobuymvc.view.ToDoItemControlRenderer = function() {
    goog.ui.ControlRenderer.call(this);
};
goog.inherits(tobuymvc.view.ToDoItemControlRenderer, goog.ui.ControlRenderer);

// add getInstance method to tobuymvc.view.ToDoItemControlRenderer
goog.addSingletonGetter(tobuymvc.view.ToDoItemControlRenderer);

/**
 * @param {goog.ui.Control} control Control to render.
 * @return {Element} Root element for the control.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.createDom = function(control) {
    var sanitizedHtml = tobuymvc.view.toDoItem({
        content: control.getContent(),
        checked: control.isChecked()
    });
    var element = /**@type {!Element}*/ (goog.dom.htmlToDocumentFragment(
        sanitizedHtml.toString()));
    this.setAriaStates(control, element);
    this.setState(control, /** @type {goog.ui.Component.State} */
        (control.getState()), true);
    return element;
};

/**
 * Updates the appearance of the control in response to a state change.
 *
 * @param {goog.ui.Control} control Control instance to update.
 * @param {goog.ui.Component.State} state State to enable or disable.
 * @param {boolean} enable Whether the control is entering or exiting the state.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.setState =
    function(control, state, enable) {
    var element = control.getElement();
    if (element) {
        switch (state) {
        case goog.ui.Component.State.CHECKED:
            this.getCheckboxElement(element).checked = enable;
            break;
        case goog.ui.Component.State.SELECTED:
            this.enableClassName(control, 'editing', enable);
            break;
        }

        this.updateAriaState(element, state, enable);
    }
};

/**
 * Returns the element within the component's DOM that should receive keyboard
 * focus (null if none).  The default implementation returns the control's root
 * element.
 * @param {goog.ui.Control} control Control whose key event target is to be
 *     returned.
 * @return {Element} The key event target.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.getKeyEventTarget =
    function(control) {
  return this.getInputElement(control.getElement());
};

/**
 * Takes the control's root element and returns the display element
 *
 * @param {Element} element Root element of the control whose display element is
 *            to be returned.
 * @return {Element} The control's display element.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.getDisplayElement = function(
        element) {
    return element ? element.childNodes[0] : null;
};

/**
 * Takes the control's root element and returns the parent element of the
 * control's contents.
 *
 * @param {Element} element Root element of the control whose content element is
 *            to be returned.
 * @return {Element} The control's content element.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.getContentElement = function(
        element) {
    return element ? this.getDisplayElement(element).childNodes[1] : null;
};

/**
 * Takes the control's root element and returns the checkbox element
 *
 * @param {Element} element Root element of the control whose checkbox element
 *            is to be returned.
 * @return {Element} The control's checkbox element.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.getCheckboxElement = function(
        element) {
    return element ? this.getDisplayElement(element).childNodes[0] : null;
};

/**
 * Takes the control's root element and returns the destroy element
 *
 * @param {Element} element Root element of the control whose destroy element is
 *            to be returned.
 * @return {Element} The control's destroy element.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.getDestroyElement = function(
        element) {
    return element ? this.getDisplayElement(element).childNodes[2] : null;
};

/**
 * Takes the control's root element and returns the input element
 *
 * @param {Element} element Root element of the control whose input element is
 *            to be returned.
 * @return {Element} The control's input element.
 */
tobuymvc.view.ToDoItemControlRenderer.prototype.getInputElement = function(
        element) {
    return element ? element.childNodes[1] : null;
};
