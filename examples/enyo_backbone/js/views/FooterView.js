/*jshint strict:false */
/*global enyo:false */
// The footer section
enyo.kind({
	name: 'ToDo.FooterView',
	id: 'info',
	tag: 'footer',
	components: [{
		tag: 'p',
		content: 'Double-click to edit a tobuy'
	}, {
		tag: 'p',
		components: [{
			tag: 'span',
			content: 'Written by: '
		}, {
			tag: 'a',
			attributes: {
				href: 'http://randomjavascript.blogspot.com/'
			},
			content: 'David Posin'
		}]
	}, {
		tag: 'p',
		allowHtml: true,
		content: 'Part of <a href="http://tobuymvc.com">TodoMVC</a>'
	}]
});
