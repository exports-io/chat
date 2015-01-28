'use strict';

angular.module('chatApp')

  .controller('IMContentCtrl', function ($scope, $rootScope, $http, $state, $timeout, $stateParams, socket, IM, Auth) {
    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;
    $scope.isTyping = false;
    $scope.imName = $stateParams.im;

    $http.get('api/users/username/' + $stateParams.im).then(function (success) {
      var users = [Auth.getCurrentUser().SEQ, success.data[0].SEQ];
      IM.users(users).then(function (success) {
        $scope.thisIM = success.data[0];

        console.log(success.data[0]);


        socket.socket.emit('join', {SEQ: $scope.thisIM.SEQ});

        $http.get('/api/chats/SEQ/' + $scope.thisIM.SEQ).success(function (results) {
          $scope.messages = results;
          console.log(results);
          socket.syncUpdates('chat', $scope.messages);
        });


      }, function (error) {
        console.log(error);
      });
    }, function (err) {
      console.log(err)
    });


    var timeout = null;
    $scope.sendMessage = function () {
      if ($scope.inputText === '') {
        return;
      }

      var tempMsg = {
        user: $scope.currentUser.name,
        text: $scope.inputText,
        SEQ: $scope.thisIM.SEQ,
        type: 'message',
        ts: moment().valueOf()
      };

      if (timeout) {
        $timeout.cancel(timeout);
      }

      $http.post('/api/chats', tempMsg).success(function (response) {
        // console.log('success' + response);
      });
      $scope.isTyping = false;
      $scope.inputText = '';
      $scope.scrollDown = true;
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

    $scope.setTyping = function () {
      var obj = {
        user: $scope.currentUser, // TODO: use name and SEQ only
        SEQ: $scope.thisIM.SEQ
      };

      socket.socket.emit('startTyping', obj); // TODO: use io.to('some room').emit('some event') to broadcast to the specific room
      // TODO: look into socket.rooms to see all rooms (might be server only code)
    };

    $scope.$on('$destroy', function () {
      socket.socket.emit('leave', {SEQ: $scope.thisIM.SEQ});
      socket.unsyncUpdates('chat');
    });
  });
