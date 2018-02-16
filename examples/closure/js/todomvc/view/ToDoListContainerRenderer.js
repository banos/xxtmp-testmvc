goog.provide('tobuymvc.view.ToDoListContainerRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');

/**
 * A renderer for the container, overridden to support keyboard focus
 * on child controls.
 * @constructor
 * @extends {goog.ui.ContainerRenderer}
 */
tobuymvc.view.ToDoListContainerRenderer = function() {
    goog.ui.ContainerRenderer.call(this);
};
goog.inherits(tobuymvc.view.ToDoListContainerRenderer,
                goog.ui.ContainerRenderer);
goog.addSingletonGetter(tobuymvc.view.ToDoListContainerRenderer);

/**
 * @param {Element} element Element to decorate.
 * @return {boolean} Whether the renderer can decorate the element.
 */
tobuymvc.view.ToDoListContainerRenderer.prototype.canDecorate =
    function(element) {
    return element.tagName == 'UL';
};

/**
 * Override this method to allow text selection in children
 *
 * @param {goog.ui.Container} container Container whose DOM is to be initialized
 *            as it enters the document.
 */
tobuymvc.view.ToDoListContainerRenderer.prototype.initializeDom =
    function(container) {
    var elem = /**@type {!Element}*/ (container.getElement());

    // Set the ARIA role.
    var ariaRole = this.getAriaRole();
    if (ariaRole) {
        goog.a11y.aria.setRole(elem, ariaRole);
    }
};
