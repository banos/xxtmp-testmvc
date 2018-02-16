/*jshint strict:false */
/*global enyo:false */
// Top level window
enyo.kind({
	name: 'ToBuy.WindowView',
	tag: 'body',
	fit: false, // Tell enyo not to manage screen size for us.  Fit true would tell enyo to adjust sizes to match the screen in a clean fashion.
	// Have 2 components divided by purpose
	components: [{
		name: 'ToBuy.notepadview',
		kind: 'ToBuy.NotepadView'
	}, {
		name: 'ToBuy.footerview',
		kind: 'ToBuy.FooterView'
	}]
});
