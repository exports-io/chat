'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('index.channel', {
        url: 'messages/{channel:[^@]*}', // perform regex
        views: {
          'content@index': {
            templateUrl: 'app/channel/channel-content.html',
            controller: 'ChannelContentCtrl',
            resolve: {
              channel: function ($q, $stateParams, ChannelAPI) {
                var channel = $stateParams.channel;
                var q = $q.defer();
                ChannelAPI.getWithName({channel: channel}).$promise.then(function (success) {
                  q.resolve(success[0])
                });
                return q.promise;
              },

              chat: function (ChatAPI, channel) {
                ChatAPI.getWithSEQ({SEQ: channel.SEQ}).$promise.then(function (results) {
                  console.log(results);
                  return results;
                });

              }
            }
          }
        }
      });
  });
