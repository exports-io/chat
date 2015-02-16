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
        ngClass: '='
      },
      link: link
    };
  }

  function link(scope, element, attrs) {

    var maxHeight = 160;
    var KEY = {
      del: 8,
      ret: 13
    };
    var _textarea = angular.element(element[0].querySelector('textarea.input-textarea'));
    var _mainContent = angular.element(document.querySelector('div.content-wrapper'));

    _textarea.originalHeight = _textarea[0].offsetHeight;
    _mainContent.originalHeight = _mainContent[0].offsetHeight;

    _textarea[0].autofocus = true;

    scope.$watch('value', function (v) {
      scope.setTyping.call(v);
    });

    element.bind('keydown', function (event) {

      if (_textarea[0].offsetHeight >= maxHeight) {
        _textarea.css('overflow-y', 'visible');
      }
      else if (event.which === KEY.del) {

        /*
         if (_textarea[0].offsetHeight > _textarea.originalHeight) {

         if (c.match(/\r/) || c.match(/\n/)) {
         _textarea.css('height', function () {
         return _textarea[0].offsetHeight - 19;
         });

         _mainContent.css('height', function () {
         return _mainContent[0].offsetHeight + 19;
         });

         _mainContent[0].scrollTop = _mainContent[0].scrollHeight;
         }
         }
         */
      }

      else if (event.which === KEY.ret && event.shiftKey) {
        if (_textarea[0].offsetHeight < maxHeight) {
          _textarea.css('height', function () {
            return _textarea[0].offsetHeight + 19;
          });

          _mainContent.css('height', function () {
            return _mainContent[0].offsetHeight - 19;
          });

          _mainContent[0].scrollTop = _mainContent[0].scrollHeight;
        }
      }
      else if (event.which === KEY.ret) {
        scope.$apply(function () {
          scope.enter();
        });

        _textarea.css('height', function () {
          return _textarea.originalHeight;
        });

        _mainContent.css('height', function () {
          return _mainContent.originalHeight;
        });

        event.preventDefault();
      }
    });
  }

})();
