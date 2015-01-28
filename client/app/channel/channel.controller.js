'use strict';

angular.module('chatApp')

  .controller('ChannelContentCtrl', function ($scope, $rootScope, $http, $state, $timeout, $stateParams, socket, Channel) {
    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;
    $scope.isTyping = false;
    $scope.channelName = $stateParams.channel;

    $http.get('/api/channels/' + $scope.channelName).then(function (success) {
      $scope.thisChannel = success.data[0];
      socket.socket.emit('join', {SEQ: $scope.thisChannel.SEQ});


      $http.get('/api/chats/SEQ/' + $scope.thisChannel.SEQ).success(function (results) {
        $scope.messages = results;
        socket.syncUpdates('chat', $scope.messages); // TODO: need to check what is 'synced' here
      });


    }, function (error) {
      console.log(error);
    });


    var timeout = null;
    $scope.sendMessage = function () {
      if ($scope.inputText === '') {
        return;
      }

      var tempMsg = {
        user: $scope.currentUser.name,
        text: $scope.inputText,
        SEQ: $scope.thisChannel.SEQ,
        type: 'message',
        ts: moment().valueOf()
      };

      if (timeout) {
        $timeout.cancel(timeout);
      }

      $http.post('/api/chats', tempMsg).success(function (response) {
        console.log('success' + response);
      });
      $scope.isTyping = false;
      $scope.inputText = '';
      $scope.scrollDown = true;
    };


    $scope.setTyping = function () {
      var obj = {
        user: $scope.currentUser, // TODO: use name and SEQ only
        SEQ: $scope.thisChannel.SEQ
      };

      socket.socket.emit('startTyping', obj); // TODO: use io.to('some room').emit('some event') to broadcast to the specific room

      // TODO: look into socket.rooms to see all rooms (might be server only code)
    };


    // set '... isTyping' message
    socket.socket.on('isTyping', function (data) {
      $scope.isTyping = true;
      $scope.userTyping = data.user;

      if (timeout) {
        $timeout.cancel(timeout);
      }

      timeout = $timeout(function () {
        $scope.isTyping = false;
      }, 4000);
    });


    $scope.$on('$destroy', function () {
      socket.socket.emit('leave', {channel: $scope.thisChannel.SEQ}); // TODO: might not need  to join rooms
      socket.unsyncUpdates('chat'); // TODO: unsync messages here
    });

  })


  .directive('enterSubmit', function () { // TODO: make directive out of input
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
