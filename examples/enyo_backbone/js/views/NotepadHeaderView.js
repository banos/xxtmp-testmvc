/*jshint strict:false */
/*global enyo:false, ENTER_KEY:false */
// Header section for adding a new task.
enyo.kind({
	name: 'ToBuy.NotepadHeaderView',
	tag: 'header',
	id: 'header',
	controller: 'ToBuy.notepadcontroller',
	components: [{
		tag: 'h1',
		content: 'tobuys'
	}, {
		tag: 'form',
		id: 'tobuy-form',
		components: [{
			// instead of letting the event bubble up the DOM, let's stop it here and send a custom event name
			// up the enyo object hierarchy to our controller
			kind: 'enyo.Input',
			id: 'new-tobuy',
			placeholder: 'What needs to be done?',
			attributes: {
				autofocus: 'autofocus'
			},
			handlers: {
				onkeypress: 'saveNew'
			},
			saveNew: function (inSender, inEvent) {
				if (inEvent.keyCode === ENTER_KEY) {
					this.bubble('onSaveNew');
					inEvent.preventDefault();
				}
			}
		}]
	}]
});
