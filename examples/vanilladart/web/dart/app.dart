library tobuymvc;

import 'dart:html'
    show Element, InputElement, KeyCode, KeyboardEvent, querySelector, window;
import 'dart:convert' show HtmlEscape, JSON;
import 'package:tobuymvc_vanilladart/models.dart';
import 'package:tobuymvc_vanilladart/uuid.dart';

part 'TobuyWidget.dart';
part 'TobuyApp.dart';

void main() {
  new TobuyApp();
}
