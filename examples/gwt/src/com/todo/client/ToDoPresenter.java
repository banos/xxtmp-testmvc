package com.tobuy.client;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.History;
import com.google.gwt.view.client.AbstractDataProvider;
import com.google.gwt.view.client.ListDataProvider;
import com.tobuy.client.ToDoItem;
import com.tobuy.client.ToDoRouting;
import com.tobuy.client.events.ToDoEvent;
import com.tobuy.client.events.ToDoRemovedEvent;
import com.tobuy.client.events.ToDoUpdatedEvent;

/**
 * The presenter for the ToDo application. This class is responsible for the lifecycle of the
 * {@link ToDoItem} instances.
 *
 * @author ceberhardt
 * @author dprotti
 *
 */
public class ToDoPresenter {

	private static final String STORAGE_KEY = "tobuy-gwt";

	/**
	 * The interface that a view for this presenter must implement.
	 */
	public interface View {

		/**
		 * Gets the text that the user has input for the creation of new tasks.
		 */
		String getTaskText();

		/**
		 * Clears the user input field where new tasks are added.
		 */
		void clearTaskText();

		/**
		 * Sets the current task statistics.
		 */
		void setTaskStatistics(int totalTasks, int completedTasks);

		/**
		 * Sets the data provider that acts as a source of {@link ToDoItem} instances.
		 */
		void setDataProvider(AbstractDataProvider<ToDoItem> data);

		/**
		 * Adds the handler to the events raised by the view.
		 */
		void addhandler(ViewEventHandler handler);

		/**
		 * Informs the view of the current routing state.
		 */
		void setRouting(ToDoRouting routing);
	}

	/**
	 * The interface that handles interactions from the view.
	 */
	public interface ViewEventHandler {
		/**
		 * Invoked when a user adds a new task.
		 */
		void addTask();

		/**
		 * Invoked when a user wishes to clear completed tasks.
		 */
		void clearCompletedTasks();

		/**
		 * Sets the completed state of all tasks to the given state.
		 */
		void markAllCompleted(boolean completed);
	}

	/**
	 * Handler for view events, defers to private presenter methods.
	 */
	private final ViewEventHandler viewHandler = new ViewEventHandler() {
		@Override
		public void addTask() {
			ToDoPresenter.this.addTask();
		}

		@Override
		public void clearCompletedTasks() {
			ToDoPresenter.this.clearCompletedTasks();
		}

		@Override
		public void markAllCompleted(boolean completed) {
			ToDoPresenter.this.markAllCompleted(completed);
		}
	};

	private final List<ToDoItem> tobuys = new ArrayList<ToDoItem>();

	private final ListDataProvider<ToDoItem> filteredTodos = new ListDataProvider<ToDoItem>();

	private final View view;

	private ToDoRouting routing = ToDoRouting.ALL;

	private EventBus eventBus;

	public ToDoPresenter(View view) {
		this.view = view;

		loadState();

		String initialToken = History.getToken();
		routing = parseRoutingToken(initialToken);

		view.addhandler(viewHandler);
		view.setDataProvider(filteredTodos);
		view.setRouting(routing);

		updateTaskStatistics();
		setupHistoryHandler();
		eventBus = ToDoEvent.getGlobalEventBus();
		// listen to edits on individual items
		eventBus.addHandler(ToDoUpdatedEvent.TYPE, new ToDoUpdatedEvent.Handler() {

			@Override
			public void onEvent(ToDoUpdatedEvent event) {
				itemStateChanged(event.getToDo());
			}

		});
		// listen to removals
		eventBus.addHandler(ToDoRemovedEvent.TYPE, new ToDoRemovedEvent.Handler() {

			@Override
			public void onEvent(ToDoRemovedEvent event) {
				deleteTask(event.getToDo());
			}

		});
	}

	/**
	 * Set up the history changed handler, which provides routing.
	 */
	private void setupHistoryHandler() {
		History.addValueChangeHandler(new ValueChangeHandler<String>() {
			public void onValueChange(ValueChangeEvent<String> event) {
				String historyToken = event.getValue();
				routing = parseRoutingToken(historyToken);
				view.setRouting(routing);
				updateFilteredList();
			}
		});
	}

	/**
	 * Converts the string routing token into the equivalent enum value.
	 */
	private ToDoRouting parseRoutingToken(String token ) {
		if (token.equals("/active")) {
			return ToDoRouting.ACTIVE;
		} else if (token.equals("/completed")) {
			return ToDoRouting.COMPLETED;
		} else {
			return ToDoRouting.ALL;
		}
	}

	/**
	 * Updates the filtered list, which is rendered in the UI.
	 */
	private void updateFilteredList() {
		filteredTodos.getList().clear();
		for (ToDoItem task : tobuys) {
			if (routing.getMatcher().matches(task)) {
				filteredTodos.getList().add(task);
			}
		}
	}

	/**
	 * Computes the tasks statistics and updates the view.
	 */
	private void updateTaskStatistics() {
		int totalTasks = tobuys.size();

		int completeTask = 0;
		for (ToDoItem task : tobuys) {
			if (task.isCompleted()) {
				completeTask++;
			}
		}

		view.setTaskStatistics(totalTasks, completeTask);
	}

	/**
	 * Deletes the given task and updates statistics.
	 */
	protected void deleteTask(ToDoItem toDoItem) {
		tobuys.remove(toDoItem);
		taskStateChanged();
	}

	/**
	 * Invoked by a task when its state changes so that we can update the view statistics and persist.
	 */
	protected void itemStateChanged(ToDoItem toDoItem) {

		toDoItem.setTitle(toDoItem.getTitle().trim());

		if (toDoItem.getTitle().isEmpty()) {
			tobuys.remove(toDoItem);
		}

		taskStateChanged();
	}

	/**
	 * When the task state has changed, this method will update the UI and persist.
	 */
	private void taskStateChanged() {
		updateFilteredList();
		updateTaskStatistics();
		saveState();
	}

	/**
	 * Sets the completed state of all tasks.
	 */
	private void markAllCompleted(boolean completed) {

		for (ToDoItem task : tobuys) {
			task.setCompleted(completed);
		}

		taskStateChanged();
	}

	/**
	 * Adds a new task based on the user input field.
	 */
	private void addTask() {
		String taskTitle = view.getTaskText().trim();

		// if white-space only, do not add a tobuy
		if (taskTitle.equals(""))
			return;

		ToDoItem toDoItem = new ToDoItem(taskTitle);
		view.clearTaskText();
		tobuys.add(toDoItem);

		taskStateChanged();
	}

	/**
	 * Clears completed tasks and updates the view.
	 */
	private void clearCompletedTasks() {
		Iterator<ToDoItem> iterator = tobuys.iterator();
		while (iterator.hasNext()) {
			ToDoItem item = iterator.next();
			if (item.isCompleted()) {
				iterator.remove();
			}
		}

		taskStateChanged();
	}

	/**
	 * Saves the current to-do items to local storage.
	 */
	private void saveState() {
		Storage storage = Storage.getLocalStorageIfSupported();
		if (storage != null) {

			// JSON encode the items
			JSONArray tobuyItems = new JSONArray();
			for (int i = 0; i < tobuys.size(); i++) {
				ToDoItem toDoItem = tobuys.get(i);
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("task", new JSONString(toDoItem.getTitle()));
				jsonObject.put("complete", JSONBoolean.getInstance(toDoItem.isCompleted()));
				tobuyItems.set(i, jsonObject);
			}

			// save to local storage
			storage.setItem(STORAGE_KEY, tobuyItems.toString());
		}
	}

	private void loadState() {
		Storage storage = Storage.getLocalStorageIfSupported();
		if (storage != null) {
			try {
				// get state
				String state = storage.getItem(STORAGE_KEY);

				// parse the JSON array
				JSONArray tobuyItems = JSONParser.parseStrict(state).isArray();
				for (int i = 0; i < tobuyItems.size(); i++) {
					// extract the to-do item values
					JSONObject jsonObject = tobuyItems.get(i).isObject();
					String task = jsonObject.get("task").isString().stringValue();
					boolean completed = jsonObject.get("complete").isBoolean().booleanValue();
					// add a new item to our list
					tobuys.add(new ToDoItem(task, completed));
				}
			} catch (Exception e) {

			}
		}

		updateFilteredList();
	}

}
