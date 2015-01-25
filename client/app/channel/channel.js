'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('index.channel', {
        url: 'messages/{channel:[^@]*}', // perform regex
        views: {
          'content@index': {
            templateUrl: 'app/channel/channel-content.html',
            controller: 'ChannelContentCtrl'
          }
        }
      });
  });
