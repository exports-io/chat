'use strict';

angular.module('chatApp')
  .controller('HomeCtrl', function ($scope, $rootScope, $http, $state, $stateParams, $timeout, socket, Auth) {

    $scope.currentUser = Auth.getCurrentUser();

    $http.get('/api/users/').success(function (results) {
      $scope.users = results;
    });

    $http.get('/api/channels/').success(function (results) {
      $scope.channels = results;
    });

    $scope.switchChannel = function (channel) {
      $state.go('index.messages', {channel: channel.name});
    };
  })

  .controller('ContentCtrl', function ($scope, $rootScope, $http, $state, $timeout, $stateParams, socket) {
    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;
    $scope.isTyping = false;

    $scope.channelName = $stateParams.channel;

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
        ts: new Date()
      };

      socket.socket.emit('im:stopTyping');
      $http.post('/api/chats', tempMsg);
      $scope.inputText = '';
      $scope.scrollDown = true;
    };

    var timeout = null;
    $scope.setTyping = function () {
      var obj = $scope.currentUser;

      socket.socket.emit('im:startTyping', obj);

      if (timeout) {
        $timeout.cancel(timeout);
      }

      timeout = $timeout(function () {
        socket.socket.emit('im:stopTyping');
      }, 4000);
    };

    socket.socket.on('im:isTyping', function (data) {
      $scope.isTyping = true;
      $scope.userTyping = data;
    });

    socket.socket.on('im:isNotTyping', function () {
      $scope.isTyping = false;
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('im');
    });


  });
