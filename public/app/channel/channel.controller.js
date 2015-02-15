(function () {

  'use strict';

  angular.module('chatApp')
    .controller('ChannelContentCtrl', ChannelContentCtrl);

  function ChannelContentCtrl($scope, $timeout, $stateParams, Auth, socket, Chat, ChannelAPI, ChatAPI) {
    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;
    $scope.isTyping = false;
    $scope.channelName = $stateParams.channel;


    ChannelAPI.getWithName({channel: $scope.channelName}).$promise.then(function (success) {
      $scope.thisChannel = success[0];
      socket.socket.emit('join', {SEQ: $scope.thisChannel.SEQ});

      ChatAPI.getWithSEQ({SEQ: success[0].SEQ}).$promise.then(function (results) {
        $scope.messages = results;
        socket.syncUpdates('chat', $scope.messages); // TODO: need to check what is 'synced' here


        var timeout = null;

        // send message to socket + server
        $scope.sendMessage = function () {
          if ($scope.inputText === '') {
            return;
          }

          if (timeout) {
            $timeout.cancel(timeout); // cancel timeout if user is still typing
          }

          var chat = new Chat(Auth.getCurrentUser().name, $scope.inputText, $scope.thisChannel.SEQ); // use
          chat.post().then(function (result) {
            //console.log(result)
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

          return socket.socket.emit('startTyping', obj);  // emit user is typing
          // TODO: use io.to('some room').emit('some event') to broadcast to the specific room
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

      });
    }, function (error) {
      console.log(error);
    });

    $scope.$on('$destroy', function () {
      socket.socket.emit('leave', {channel: $scope.thisChannel.SEQ}); // TODO: might not need  to join rooms
      socket.unsyncUpdates('chat'); // TODO: unsync messages here
    });
  }

})();
