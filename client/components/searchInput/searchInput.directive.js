(function () {

  'use strict';

  if (angular.element.prototype.querySelectorAll === undefined) {
    angular.element.prototype.querySelectorAll = function (selector) {
      return angular.element(this[0].querySelectorAll(selector));
    };
  }

  angular.module('chatApp')
    .directive('searchInput', searchInput)
    .filter('highlight', highlightFilter);

  function searchInput($timeout, ChatAPI) {
    return {
      templateUrl: 'components/searchInput/searchInput.html',
      restrict: 'E',
      scope: {
        model: '=ngModel'
      },
      link: function (scope, element, attrs) {
        var _searchInput = element.querySelectorAll('input.search-input');
        var _dropdownDiv = element.querySelectorAll('div.search-dropdown');
        var _timeout;

        _searchInput.on('focus', function () {
          _dropdownDiv[0].style.display = 'block';

          scope.$watch('model', function (v) {
            // debounce query
            if (_timeout) {
              $timeout.cancel(_timeout);
            }

            _timeout = $timeout(function () {
              _timeout = null;
              if (v !== undefined && v !== '') {
                ChatAPI.query(v).then(function (results) {
                  scope.searchResults = results.data;
                });
              }
              else {
                scope.searchResults = null;
              }
            });
          });
        });

        _searchInput.on('blur', function () {
          _dropdownDiv[0].style.display = 'none';
        });

      }
    };
  }

  function highlightFilter() {
    return function (text, search, caseSensitive) {
      if (text && (search || angular.isNumber(search))) {
        text = text.toString();
        search = search.toString();
        if (caseSensitive) {
          return text.split(search).join('<span class="ui-match">' + search + '</span>');
        } else {
          return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
        }
      } else {
        return text;
      }
    };
  }

})();
