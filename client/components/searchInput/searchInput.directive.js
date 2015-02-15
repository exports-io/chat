(function () {

  'use strict';

  angular.module('chatApp')
    .directive('searchInput', searchInput);

  function searchInput() {
    return {
      templateUrl: 'components/searchInput/searchInput.html',
      restrict: 'E',
      scope: {
        value: '=ngModel',
        results: '&',
        change: '&'
      },
      link: function (scope, element, attrs) {

        /*
         scope.$watch('value', function (v) {
         scope.change.call(v);
         })
         */

      },
      controller: ['$scope', '$http',function ($scope, $http) {
        /*
         $scope.querySearch = function (query) {
         $http.get('/api/chats/query/' + query).then(function (results) {
         $scope.searchResults = results.data;
         })
         };
         */
      }]
    };
  }

})();
