'use strict';

angular.module('chatApp')

  .controller('ChannelContentCtrl', function ($scope, $rootScope, $http, $state, $timeout, $stateParams, socket) {
    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;
    $scope.isTyping = false;
    $scope.channelName = $stateParams.channel;

    $http.get('/api/channels/' + $scope.channelName).then(function (success) {
      $scope.thisChannel = success.data[0];
    }, function (error) {
      console.log(error);
    });

    socket.socket.emit('join', {channel: $scope.channelName});

    $http.get('/api/chats/' + $scope.channelName).success(function (results) {
      $scope.messages = results;
      socket.syncUpdates('chat', $scope.messages);
    });


    $scope.sendMessage = function () {
      if ($scope.inputText === '') {
        return;
      }

      var tempMsg = {
        user: $scope.currentUser.name,
        text: $scope.inputText,
        channel: $scope.channelName,
        type: 'message',
        ts: moment().valueOf()
      };

      var obj = {
        user: $scope.currentUser,
        channel: $scope.channelName
      };

      socket.socket.emit('stopTyping', obj);
      $http.post('/api/chats', tempMsg);
      $scope.inputText = '';
      $scope.scrollDown = true;
    };

    var timeout = null;
    $scope.setTyping = function () {
      var obj = {
        user: $scope.currentUser,
        channel: $scope.channelName
      };

      socket.socket.emit('startTyping', obj);

      if (timeout) {
        $timeout.cancel(timeout);
      }

      timeout = $timeout(function () {
        socket.socket.emit('stopTyping', obj);
      }, 4000);
    };

    socket.socket.on('isTyping', function (data) {
      $scope.isTyping = true;
      $scope.userTyping = data.user;
    });

    socket.socket.on('isNotTyping', function () {
      $scope.isTyping = false;
    });

    $scope.$on('$destroy', function () {
      socket.socket.emit('leave', {channel: $scope.channelName});
      socket.unsyncUpdates('chat');
    });

  })


  .directive('enterSubmit', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {

        elem.bind('keydown', function (event) {
          var code = event.keyCode || event.which;

          if (code === 13) {
            if (!event.shiftKey) {
              event.preventDefault();
              scope.$apply(attrs.enterSubmit);
            }
          }
        });
      }
    }
  });
