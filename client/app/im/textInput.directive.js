'use strict';

angular.module('chatApp')

  .directive('textInput', function () {
    return {
      restrict: 'E',
      scope: {
        value: '=ngModel',
        change: '=',
        ngEnter: '&',
        isTyping: '='
        //ngClass: "{'input-drawer-open': drawerOpen}"
      },
      require: 'ngModel',
      template: '<div class="textfield-footer">' +
      '<textarea class="input-textarea" ng-model="value" ng-change="change"></textarea>' +
      '<span class="isTyping" ng-if="isTyping"><span class="isType-name">{{userTyping.name}}</span> is typing ...</span>' +
      '</div>',
      link: function (scope, element, attrs) {

        var maxHeight = 160;
        var KEY = {
          del: 8,
          ret: 13
        };
        var $textarea = angular.element(element[0].querySelector('textarea.input-textarea'));
        var $mainContent = angular.element(document.querySelector('div.content-wrapper'));

        $textarea.originalHeight = $textarea[0].offsetHeight;
        $mainContent.originalHeight = $mainContent[0].offsetHeight;


        element.bind("keydown", function (event) {

          /*
           scope.value = $textarea.val().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>')
           .replace(/\s{2,}/g, function (space) {
           return times('&nbsp;', space.length - 1) + ' '
           });
           */

          if ($textarea[0].offsetHeight >= maxHeight) {
            $textarea.css('overflow-y', 'visible');
          }

          else if (event.which === KEY.ret && event.shiftKey) {
            if ($textarea[0].offsetHeight < maxHeight) {
              $textarea.css('height', function () {
                return $textarea[0].offsetHeight + 19;
              });

              $mainContent.css('height', function () {
                return $mainContent[0].offsetHeight - 19;
              });
            }
          }
          else if (event.which === KEY.ret) {
            scope.$apply(function () {
              scope.ngEnter();
            });

            $textarea.css('height', function () {
              return $textarea.originalHeight
            });

            $mainContent.css('height', function () {
              return $mainContent.originalHeight
            });

            event.preventDefault();
          }
        });
      }
    };
  });
