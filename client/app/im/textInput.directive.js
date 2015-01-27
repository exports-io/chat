'use strict';

angular.module('chatApp')

  .directive('textInput', function ($window) {
    return {
      restrict: 'E',
      scope: {
        value: '=ngModel',
        ngChange: '=',
        ngEnter: '&'
      },
      require: 'ngModel',
      template: '<div class="textfield-footer">' +
      '<textarea class="input-textarea" ng-model="value"></textarea>' +
      '<span class="isTyping" ng-if="isTyping"><span class="isType-name">{{userTyping.name}}</span> is typing ...</span>' +
      '</div>',
      link: function (scope, element, attrs) {

        var maxHeight = 100;

        var $textarea = angular.element(element[0].querySelector('textarea.input-textarea'));


        element.bind("keydown", function (event) {
          if (event.which === 13 && event.shiftKey) {
            $textarea.val().replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/&/g, '&amp;')
              .replace(/\n$/, '<br/>&nbsp;')
              .replace(/\n/g, '<br/>')
              .replace(/\s{2,}/g, function (space) {
                return times('&nbsp;', space.length - 1) + ' '
              });

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
