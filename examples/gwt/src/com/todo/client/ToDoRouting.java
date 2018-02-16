package com.tobuy.client;

public enum ToDoRouting {
	/**
	 * Displays all tobuy items.
	 */
	ALL(new MatchAll()),
	/**
	 * Displays active tobuy items - i.e. those that have not been done.
	 */
	ACTIVE(new MatchActive()),
	/**
	 * Displays completed tobuy items - i.e. those that have been done.
	 */
	COMPLETED(new MatchCompleted());

	/**
	 * Matcher used to filter tobuy items, based on some criteria.
	 */
	public interface Matcher {
		/**
		 * Determines whether the given tobuy item meets the criteria of this matcher.
		 */
		boolean matches(ToDoItem item);
	}

	/**
	 * A matcher that matches any tobuy item.
	 */
	private static class MatchAll implements Matcher {
		@Override
		public boolean matches(ToDoItem item) {
			return true;
		}
	}

	/**
	 * A matcher that matches only active tobuy items.
	 */
	private static class MatchActive implements Matcher {
		@Override
		public boolean matches(ToDoItem item) {
			return !item.isCompleted();
		}
	}

	/**
	 * A matcher that matches only completed tobuy items.
	 */
	private static class MatchCompleted implements Matcher {
		@Override
		public boolean matches(ToDoItem item) {
			return item.isCompleted();
		}
	}

	private final Matcher matcher;

	private ToDoRouting(Matcher matcher) {
		this.matcher = matcher;
	}

	public Matcher getMatcher() {
		return matcher;
	}
}
