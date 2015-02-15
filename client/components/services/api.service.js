(function () {
  'use strict';

  angular.module('chatApp')
    .service('ChannelAPI', ChannelAPI)
    .service('ChatAPI', ChatAPI);

  function ChatAPI($resource) {
    return $resource('api/chats/:SEQ:query', {}, {
      getAll: {method: 'GET', isArray: true},
      getWithSEQ: {method: 'GET', isArray: true, params: {SEQ: '@SEQ'}},
      query: {method: 'GET', isArray: true, params: {query: '@query'}},
      post: {method: 'POST'}
    })
  }

  function ChannelAPI($resource) {
    return $resource('api/channels/:channel', {}, {
      getAll: {method: 'GET', isArray: true},
      getWithName: {method: 'GET', isArray: true, params: {channel: '@channel'}},
      post: {method: 'POST'}
    })
  }
})();
