/*global define */
'use strict';

define([
	'data/tobuys',
	'data/stats',
	'ui/new_item',
	'ui/tobuy_list',
	'ui/stats',
	'ui/main_selector',
	'ui/toggle_all'
], function (TobuysData, StatsData, NewItemUI, TobuyListUI, StatsUI, MainSelectorUI, ToggleAllUI) {
	var initialize = function () {
		StatsData.attachTo(document);
		TobuysData.attachTo(document);
		NewItemUI.attachTo('#new-tobuy');
		MainSelectorUI.attachTo('#main');
		StatsUI.attachTo('#footer');
		ToggleAllUI.attachTo('#toggle-all');
		TobuyListUI.attachTo('#tobuy-list');
	};

	return {
		initialize: initialize
	};
});
