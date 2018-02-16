import 'package:di/di.dart';
import 'package:angular/angular.dart';

import 'tobuy.dart';
import 'directives.dart';

main() {
	var module = new Module()
		..type(StorageService)
		..type(TobuyController)
		..type(TobuyDOMEventDirective);
	ngBootstrap(module: module);
}
