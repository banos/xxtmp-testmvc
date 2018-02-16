define([
	'directives/tobuyFocus',
	'angular-mocks'
], function (tobuyFocusDir) {
	'use strict';

	beforeEach(module(tobuyFocusDir));

	describe('tobuyFocus directive', function () {
		var scope, compile, browser;

		beforeEach(inject(function ($rootScope, $compile, $browser) {
			scope = $rootScope.$new();
			compile = $compile;
			browser = $browser;
		}));

		it('should focus on truthy expression', function () {
			var el = angular.element('<input tobuy-focus="focus">');
			scope.focus = false;

			compile(el)(scope);
			expect(browser.deferredFns.length).toBe(0);

			scope.$apply(function () {
				scope.focus = true;
			});

			expect(browser.deferredFns.length).toBe(1);
		});
	});
});
