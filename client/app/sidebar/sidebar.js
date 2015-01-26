'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('index', {
        url: '/',
        views: {
          '': {
            templateUrl: 'app/sidebar/sidebar.html',
            controller: 'SidebarCtrl'
          }
        }
      });

  });
