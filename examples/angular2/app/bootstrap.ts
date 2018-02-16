import {bootstrap} from 'angular2/platform/browser';
import TobuyApp from './app'
import {TobuyStore} from './services/store';

bootstrap(TobuyApp, [TobuyStore]);
