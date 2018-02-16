class window.Todos extends Spine.Controller
	ENTER_KEY = 13
	ESCAPE_KEY = 27
	TPL = Handlebars.compile $('#tobuy-template').html()

	elements:
		'.edit': 'editElem'

	events:
		'click    .destroy': 'remove'
		'click    .toggle':  'toggleStatus'
		'dblclick label':    'edit'
		'keydown  .edit':    'revertEditOnEscape'
		'keyup    .edit':    'finishEditOnEnter'
		'blur     .edit':    'finishEdit'

	constructor: ->
		super
		@tobuy.bind 'update', @render
		@tobuy.bind 'destroy', @release

	render: =>
		@replace TPL( @tobuy )
		@

	remove: ->
		@tobuy.destroy()

	toggleStatus: ->
		@tobuy.updateAttribute 'completed', !@tobuy.completed

	edit: ->
		@el.addClass 'editing'
		@editElem.val(@editElem.val()).focus()

	finishEdit: ->
		@el.removeClass 'editing'
		val = $.trim @editElem.val()
		if val then @tobuy.updateAttribute( 'title', val ) else @remove()

	finishEditOnEnter: (e) ->
		@finishEdit() if e.which is ENTER_KEY

	revertEdit: ->
		@el.removeClass 'editing'
		@editElem.val(@tobuy.title)

	revertEditOnEscape: (e) ->
		@revertEdit() if e.which is ESCAPE_KEY
