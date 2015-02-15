(function () {
  'use strict';

  angular.module('chatApp')
    .controller('IMContentCtrl', IMContentCtrl);

  function IMContentCtrl($scope, $timeout, $stateParams, socket, Chat, ImAPI, UserAPI, ChatAPI, Auth) {

    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;
    $scope.isTyping = false;
    $scope.imName = $stateParams.im;

    // retrieve Users w/ username
    UserAPI.getWithUsername({username: $scope.imName}).$promise.then(function (success) {
      var users = [Auth.getCurrentUser().SEQ, success[0].SEQ];

      // retrieve IMs w/ users
      ImAPI.users(users).then(function (result) {
        $scope.thisIM = result.data[0];

        socket.socket.emit('join', {SEQ: result.data[0].SEQ});

        // retrieve Chats with IM SEQ room #
        ChatAPI.getWithSEQ({SEQ: result.data[0].SEQ}).$promise.then(function (res) {
          $scope.messages = res;
          socket.syncUpdates('chat', $scope.messages);
        });


        // when user is typing emit to others in the room
        $scope.setTyping = function () {
          var obj = {
            user: $scope.currentUser, // TODO: use name and SEQ only
            SEQ: $scope.thisIM.SEQ
          };

          socket.socket.emit('startTyping', obj);
          // TODO: use io.to('some room').emit('some event') to broadcast to the specific room
          // TODO: look into socket.rooms to see all rooms (might be server only code)
        };


        var timeout = null;
        $scope.sendMessage = function () {
          if ($scope.inputText === '') {
            return;
          }

          // create new Chat model and post to server
          var chat = new Chat(Auth.getCurrentUser().name, $scope.inputText, $scope.thisIM.SEQ); // use
          chat.post().then(function (result) {
            $scope.isTyping = false;
            $scope.inputText = '';
            $scope.scrollDown = true;
          });
        };


        // set '... isTyping' message
        socket.socket.on('isTyping', function (data) {
          $scope.isTyping = true;
          $scope.userTyping = data.user;

          // cancel timeout if still typing
          if (timeout) {
            $timeout.cancel(timeout);
          }

          timeout = $timeout(function () {
            $scope.isTyping = false;
          }, 4000);
        });


      }, function (error) {
        console.log(error);
      });
    });


    // when scope is destroyed, leave room and un-sync chats
    $scope.$on('$destroy', function () {
      socket.socket.emit('leave', {SEQ: $scope.thisIM.SEQ});
      socket.unsyncUpdates('chat');
    });
  }

})();
