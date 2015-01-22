'use strict';

angular.module('chatApp')
  .controller('HomeCtrl', function ($scope, $http, $timeout, socket, Auth) {
    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;
    $scope.isTyping = false;


    $scope.currentUser = Auth.getCurrentUser();

    $http.get('/api/ims').success(function (results) {
      $scope.messages = results;
      socket.syncUpdates('im', $scope.messages);
    });

    $scope.sendMessage = function () {
      if ($scope.message === '') {
        return;
      }
      var tempMsg = {
        user: $scope.currentUser.name,
        text: $scope.inputText,
        type: 'message',
        ts: new Date()
      };

      $http.post('/api/ims', tempMsg);
      $scope.inputText = '';
      $scope.scrollDown = true;
    };


    socket.socket.on('im:isTyping', function (data) {
      if (data._id !== $scope.currentUser._id) {
        $scope.isTyping = true;
        $scope.userTyping = data;
      }
    });

    socket.socket.on('im:stopTyping', function () {
      $scope.isTyping = false;
    });

    $scope.setTyping = function () {
      var obj = $scope.currentUser;

      socket.socket.emit('im:isTyping', obj);
      $timeout(function () {
        socket.socket.emit('im:stopTyping');
      }, 10000);
    };


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('im');
    });

  });
