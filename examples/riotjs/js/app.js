/*global riot, tobuyStorage */

(function () {
	'use strict';

	riot.mount('tobuy', { data: tobuyStorage.fetch() });
}());
