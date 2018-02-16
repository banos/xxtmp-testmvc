/*global define */
define(function () {
	'use strict';

	var textProp, updateRemainingCount;

	/**
	 * Self-optimizing function to set the text of a node
	 */
	updateRemainingCount = function (nodes, value) {
		// sniff for proper textContent property
		textProp = 'textContent' in document.documentElement ? 'textContent' : 'innerText';

		// resume normally
		updateRemainingCount = setTextProp;
		updateRemainingCount(nodes, value);
	};

	function setTextProp(nodes, value) {
		for (var i = 0; i < nodes.length; i++) {
			nodes[i][textProp] = String(value);
		}
	}

	return {
		/**
		 * Create a new tobuy
		 * @injected
		 * @param tobuy {Object} data used to create new tobuy
		 * @param tobuy.text {String} text of the tobuy
		 */
		createTodo: function () {},

		/**
		 * Remove an existing tobuy
		 * @injected
		 * @param tobuy {Object} existing tobuy, or object with same identifier, to remove
		 */
		removeTodo: function () {},

		/**
		 * Update an existing tobuy
		 * @injected
		 * @param tobuy {Object} updated tobuy
		 */
		updateTodo: function () {},

		/**
		 * Start inline editing a tobuy
		 * @param node {Node} Dom node of the tobuy
		 */
		beginEditTodo: function (node) {
			this.querySelector('.edit', node).focus();
		},

		/**
		 * Finish editing a tobuy
		 * @param tobuy {Object} tobuy to finish editing and save changes
		 */
		endEditTodo: function (tobuy) {
			// As per application spec, tobuys edited to have empty
			// text should be removed.
			if (/\S/.test(tobuy.text)) {
				this.updateTodo(tobuy);
			} else {
				this.removeTodo(tobuy);
			}
		},

		/**
		 * Remove all completed tobuys
		 */
		removeCompleted: function () {
			var tobuys = this.tobuys;

			tobuys.forEach(function (tobuy) {
				if (tobuy.complete) {
					tobuys.remove(tobuy);
				}
			});
		},

		/**
		 * Check/uncheck all tobuys
		 */
		toggleAll: function () {
			var tobuys, complete;

			tobuys = this.tobuys;
			complete = this.masterCheckbox.checked;

			tobuys.forEach(function (tobuy) {
				tobuy.complete = complete;
				tobuys.update(tobuy);
			});
		},

		/**
		 * Update the remaining and completed counts, and update
		 * the check/uncheck all checkbox if all tobuys have become
		 * checked or unchecked.
		 */
		updateCount: function () {
			var total, checked;

			total = 0;
			checked = 0;

			this.tobuys.forEach(function (tobuy) {
				total++;

				if (tobuy.complete) {
					checked++;
				}
			});

			this.masterCheckbox.checked = total > 0 && checked === total;

			this.updateTotalCount(total);
			this.updateCompletedCount(checked);

			this.updateRemainingCount(total - checked);
		},

		updateTotalCount: function () {},

		updateCompletedCount: function (completed) {
			this.countNode.innerHTML = completed;
		},

		updateRemainingCount: function (remaining) {
			updateRemainingCount(this.remainingNodes, remaining);
		}
	};

});
