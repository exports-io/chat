(function () {
  'use strict';

  angular.module('chatApp')
    .factory('Chat', ChatService)
    .factory('ErrorLog', ErrorLogService);

  function ChatService($http) {
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
  }


  function ErrorLogService($http) {
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
  }
})();
