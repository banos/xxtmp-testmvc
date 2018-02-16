import 'dart:html' as dom;
import 'package:angular/angular.dart';

@NgDirective(
	selector: '[tobuy-escape]',
	map: const {'tobuy-escape': '&onEscape'}
)
@NgDirective(
	selector: '[tobuy-focus]',
	map: const {'tobuy-focus': '@tobuyFocus'}
)
class TobuyDOMEventDirective {
	final Map<int, Function> listeners = {};
	final dom.Element element;
	final Scope scope;

	TobuyDOMEventDirective(this.element, this.scope);

	void initHandler(stream, value, [bool predicate(event)]) {
		final int key = stream.hashCode;

		if (!listeners.containsKey(key)) {
			listeners[key] = value;
			stream.listen((event) => scope.$apply(() {
				if (predicate == null || predicate(event)) {
					event.preventDefault();
					value({r'$event': event});
				}
			}));
		}
	}

	set onEscape(value) {
		initHandler(element.onKeyDown, value, (event) => event.keyCode ==
				dom.KeyCode.ESC);
	}

	set tobuyFocus(watchExpr) {
		scope.$watch(watchExpr, (value) {
			if (value) {
				element.focus();
			}
		});
	}
}
