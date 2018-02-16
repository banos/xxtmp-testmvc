import {Router} from 'aurelia-router';
import {Tobuys} from './tobuys';

export class App {
	static inject() { return [Router]; }

	constructor(router) {
		this.router = router;
		this.router.configure(this.configureRoutes);
	}

	configureRoutes(cfg) {
		cfg.title = 'TobuyMVC';
		cfg.map([
			{ route: ['', ':filter'], moduleId: 'tobuys' }
		]);
	}
}
