'use strict';

describe('Directive: searchInput', function () {

  // load the directive's module and view
  beforeEach(module('chatApp'));
  beforeEach(module('components/searchInput/searchInput.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-input></search-input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the searchInput directive');
  }));
});