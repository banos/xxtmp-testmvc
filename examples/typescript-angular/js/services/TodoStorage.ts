/// <reference path='../_all.ts' />

module tobuys {
    'use strict';

    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    export class TodoStorage implements ITodoStorage {

        STORAGE_ID = 'tobuys-angularjs-typescript';

        get (): TodoItem[] {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        }

        put(tobuys: TodoItem[]) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(tobuys));
        }
    }
}