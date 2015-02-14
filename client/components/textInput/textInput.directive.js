(function () {
  'use strict';

  angular.module('chatApp')
    .directive('textInput', textInput);


  function textInput() {
    return {
      templateUrl: 'components/textInput/textInput.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        value: '=ngModel',
        setTyping: '&',
        enter: '&',
        isTyping: '=',
        userTyping: '=',
        ngClass: "="
      },
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

        scope.$watch('value', function (v) {
          scope.setTyping.call(v);
        });

        element.bind("keydown", function (event) {

          if ($textarea[0].offsetHeight >= maxHeight) {
            $textarea.css('overflow-y', 'visible');
          }
          else if (event.which === KEY.del) {

            /*
             if ($textarea[0].offsetHeight > $textarea.originalHeight) {

             if (c.match(/\r/) || c.match(/\n/)) {
             $textarea.css('height', function () {
             return $textarea[0].offsetHeight - 19;
             });

             $mainContent.css('height', function () {
             return $mainContent[0].offsetHeight + 19;
             });

             $mainContent[0].scrollTop = $mainContent[0].scrollHeight;
             }
             }
             */
          }

          else if (event.which === KEY.ret && event.shiftKey) {
            if ($textarea[0].offsetHeight < maxHeight) {
              $textarea.css('height', function () {
                return $textarea[0].offsetHeight + 19;
              });

              $mainContent.css('height', function () {
                return $mainContent[0].offsetHeight - 19;
              });

              $mainContent[0].scrollTop = $mainContent[0].scrollHeight;
            }
          }
          else if (event.which === KEY.ret) {
            scope.$apply(function () {
              scope.enter();
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
    }
  }

})();
