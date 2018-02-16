/// <reference path='../_all.ts' />

module tobuys {
	export interface ITodoStorage {
		get (): TodoItem[];
		put(tobuys: TodoItem[]);
	}
}