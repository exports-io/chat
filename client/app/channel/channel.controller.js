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
      socket.syncUpdates('chat', $scope.messages); // need to check what is 'synced' here
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
        user: $scope.currentUser, // use name and SEQ only
        channel: $scope.channelName
      };

      socket.socket.emit('stopTyping', obj); // need to send less information here (only vitals)
      $http.post('/api/chats', tempMsg);
      $scope.inputText = '';
      $scope.scrollDown = true;
    };

    var timeout = null;
    $scope.setTyping = function () {
      var obj = {
        user: $scope.currentUser, // use name and SEQ only
        channel: $scope.channelName
      };

      socket.socket.emit('startTyping', obj); // use io.to('some room').emit('some event') to broadcast to the specific room

      // look into socket.rooms to see all rooms (might be server only code)

      if (timeout) {
        $timeout.cancel(timeout);
      }

      timeout = $timeout(function () {
        socket.socket.emit('stopTyping', obj); // get rid of this
      }, 4000);
    };

    socket.socket.on('isTyping', function (data) { // make a timeout here if recevied 'isTyping' event --> no need to check for stop typing
      $scope.isTyping = true;
      $scope.userTyping = data.user;
    });

    socket.socket.on('isNotTyping', function () { // might not be necessary
      $scope.isTyping = false;
    });

    $scope.$on('$destroy', function () {
      socket.socket.emit('leave', {channel: $scope.channelName}); // might not need  to join rooms
      socket.unsyncUpdates('chat'); // unsync messages here
    });

  })


  .directive('enterSubmit', function () { // make directive out of input
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
    };
  });
