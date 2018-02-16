/// <reference path='../_all.ts' />

module tobuys {
	export interface ITodoScope extends ng.IScope {
		tobuys: TodoItem[];
		newTodo: string;
		editedTodo: TodoItem;
		originalTodo: TodoItem;
		remainingCount: number;
		doneCount: number;
		allChecked: boolean;
		reverted: boolean;
		statusFilter: { completed?: boolean };
		location: ng.ILocationService;
		vm: TodoCtrl;
	}
}
