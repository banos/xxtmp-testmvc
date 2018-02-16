class window.Todo extends Spine.Model
	@configure 'Todo', 'title', 'completed'
	@extend Spine.Model.Local

	@active: ->
		@select (tobuy) -> !tobuy.completed

	@completed: ->
		@select (tobuy) -> !!tobuy.completed

	@destroyCompleted: ->
		tobuy.destroy() for tobuy in @completed()
