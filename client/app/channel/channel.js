(function () {

  'use strict';

  angular.module('chatApp')
    .config(config);

  function config($stateProvider) {
    $stateProvider

      .state('index.channel', {
        url: 'messages/{channel:[^@]*}', // perform regex to only allow channels (not IMs)
        views: {
          'content@index': {
            templateUrl: 'app/channel/channel-content.html',
            controller: 'ChannelContentCtrl',
            resolve: {
              channel: channel,
              chat: chat
            }
          }
        }
      });
  }

  function channel($q, $stateParams, ChannelAPI) {
    var channel = $stateParams.channel;
    var q = $q.defer();
    ChannelAPI.getWithName({channel: channel}).$promise.then(function (success) {
      q.resolve(success[0])
    });
    return q.promise;
  }

  function chat(ChatAPI, channel) {
    ChatAPI.getWithSEQ({SEQ: channel.SEQ}).$promise.then(function (results) {
      //console.log(results);
      return results;
    });
  }

})();
