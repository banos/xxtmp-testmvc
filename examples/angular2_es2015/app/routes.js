import { TobuyListComponent } from './components/tobuy-list/tobuy-list.component';

export let routes = [
  { path: '', component: TobuyListComponent, pathMatch: 'full' },
  { path: ':status', component: TobuyListComponent }
];
