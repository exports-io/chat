'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('index', {
        url: '/',
        views: {
          '': {
            templateUrl: 'app/home/messages.html',
            controller: 'MessagesCtrl'
          }
        }
      })

      .state('index.messages', {
        url: 'messages/{channel}',
        views: {
          'content@index': {
            templateUrl: 'app/home/content.html',
            controller: 'ContentCtrl'
          }
        }
      });
  });
