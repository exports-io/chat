'use strict';

angular.module('chatApp')

  .directive('textInput', function ($window) {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        ngChange: '=',
        ngEnter: '&'
      },
      require: 'ngModel',
      template: '<div class="textfield-footer">' +
      '<textarea class="input-textarea" ng-model="ngModel"></textarea>' +
      '<span class="isTyping" ng-if="isTyping"><span class="isType-name">{{userTyping.name}}</span> is typing ...</span>' +
      '</div>',
      link: function (scope, element, attrs) {

        var maxHeight = 100;

        var $textarea = angular.element(element[0]);
        console.log($textarea);


        element.bind("keydown", function (event) {
          if (event.which === 13 && event.shiftKey) {
            console.log('shift + enter');
            console.log(element);
          }
          else if (event.which === 13) {
            scope.$apply(function () {
              scope.ngEnter();
            });
            event.preventDefault();
          }
        });
      }
    };
  });
