import {Router} from 'aurelia-router';
import {Todos} from './tobuys';

export class App {
	static inject() { return [Router]; }

	constructor(router) {
		this.router = router;
		this.router.configure(this.configureRoutes);
	}

	configureRoutes(cfg) {
		cfg.title = 'TodoMVC';
		cfg.map([
			{ route: ['', ':filter'], moduleId: 'tobuys' }
		]);
	}
}
