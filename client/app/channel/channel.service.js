'use strict';

angular.module('chatApp')

  .service('ChannelAPI', function ($resource) {
    return $resource('api/channels/:channel', {}, {
      getAll: {method: 'GET', isArray: true},
      getWithName: {method: 'GET', isArray: true, params: {channel: '@channel'}},
      post: {method: 'POST'}
    })
  })

  .service('ChatAPI', function ($resource) {
    return $resource('api/chats/:id/SEQ/:SEQ', {}, {
      getAll: {method: 'GET', isArray: true},
      getWithSEQ: {method: 'GET', isArray: true, params: {SEQ: '@SEQ'}},
      post: {method: 'POST'}
    })
  })


  .factory('Chat', function ($q, $http) {

    function Chat(user, text, SEQ) {
      this.user = user;
      this.text = text;
      this.SEQ = SEQ;
      this.type = 'message';
      this.ts = moment().valueOf();
    }

    Chat.prototype.post = function () {
      return $http.post('/api/chats', this);
    };

    return Chat;
  })

  .factory('ErrorLog', function ($q, $http) {

    function ErrorLog(user, text, SEQ) {
      this.user = user;
      this.text = text;
      this.SEQ = SEQ;
      this.type = 'message';
      this.ts = moment().valueOf();
    }

    ErrorLog.prototype.post = function () {
      return $http.post('/api/chats', this);
    };

    return ErrorLog;
  });

