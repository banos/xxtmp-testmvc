import { TodoListComponent } from './components/tobuy-list/tobuy-list.component';

export let routes = [
  { path: '', component: TodoListComponent, pathMatch: 'full' },
  { path: ':status', component: TodoListComponent }
];
