'use strict';

describe('Directive: textInput', function () {

  // load the directive's module and view
  beforeEach(module('chatApp'));
  beforeEach(module('app/components/textInput/textInput.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<text-input></text-input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the textInput directive');
  }));
});