(function () {

  'use strict';

  if (angular.element.prototype.querySelectorAll === undefined) {
    angular.element.prototype.querySelectorAll = function (selector) {
      return angular.element(this[0].querySelectorAll(selector));
    };
  }

  angular.module('chatApp')
    .directive('searchInput', searchInput);

  function searchInput(ChatAPI) {
    return {
      templateUrl: 'components/searchInput/searchInput.html',
      restrict: 'E',
      scope: {
        model: '=ngModel'
      },
      link: function (scope, element, attrs) {

        var _searchInput = element.querySelectorAll('input.search-input');
        var _dropdownDiv = element.querySelectorAll('div.search-dropdown');

        _searchInput.on('focus', function () {
          _dropdownDiv[0].style.display = 'block';

          scope.$watch('model', function (v) {
            if (v !== undefined || v == '') {
              ChatAPI.query(v).then(function (results) {
                scope.searchResults = results.data;
              });
            }
          });
        });

        _searchInput.on('blur', function () {
          _dropdownDiv[0].style.display = 'none';
        });

      }
    };
  }

})();
