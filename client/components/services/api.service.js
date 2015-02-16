(function () {
  'use strict';

  angular.module('chatApp')
    .service('ChannelAPI', ChannelAPI)
    .service('ChatAPI', ChatAPI)
    .service('UserAPI', UserAPI);

  function ChatAPI($http) {
    return {
      getAll: function () {
        return $http.get('api/chats/');
      },
      getWithSEQ: function (SEQ) {
        return $http.get('api/chats/' + SEQ);
      },

      query: function (query) {
        return $http.get('api/chats/query/' + query);
      },
      post: function (data) {
        return $http.post('api/chats/', data);
      }
    };
  }

  function ChannelAPI($resource) {
    return $resource('api/channels/:channel', {}, {
      getAll: {method: 'GET', isArray: true},
      getWithName: {method: 'GET', isArray: true, params: {channel: '@channel'}},
      post: {method: 'POST'}
    });
  }

  function UserAPI($resource) {
    return $resource('api/users/:id/username/:username', {}, {
      getAll: {method: 'GET', isArray: true},
      getWithUsername: {method: 'GET', isArray: true, params: {username: '@username'}},
      post: {method: 'POST'}
    });
  }

})();
