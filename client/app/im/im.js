'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('index.im', {
        url: 'messages/@{im}', //:[@]*
        views: {
          'content@index': {
            templateUrl: 'app/im/im-content.html',
            controller: 'IMContentCtrl'
          }
        }
      });
  });
