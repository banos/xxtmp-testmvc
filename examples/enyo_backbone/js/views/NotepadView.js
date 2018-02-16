/*jshint strict:false */
/*global enyo:false */
// This is the notepad area
enyo.kind({
	name: 'ToBuy.NotepadView',
	id: 'tobuyapp',
	tag: 'section',
	// Break the notepad into three easily handled components by purpose.
	components: [{
		name: 'ToBuy.notepadviewheader',
		kind: 'ToBuy.NotepadHeaderView'
	}, {
		name: 'ToBuy.notepadviewmain',
		kind: 'ToBuy.NotepadMainView'
	}, {
		name: 'ToBuy.notepadviewfooter',
		kind: 'ToBuy.NotepadFooterView'
	}]
});
