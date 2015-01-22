'use strict';

angular.module('chatApp')
  .controller('HomeCtrl', function ($scope, $http, socket) {
    $scope.inputText = '';
    $scope.messages = [];
    $scope.scrollDown = true;

    $http.get('/api/ims').success(function (results) {
      $scope.messages = results;
      socket.syncUpdates('im', $scope.messages);
    });

    $scope.sendMessage = function () {
      if ($scope.message === '') {
        return;
      }
      var tempMsg = {
        user: 'tmp',
        text: $scope.inputText,
        type: 'message',
        ts: new Date()
      };

      $http.post('/api/ims', tempMsg);
      $scope.inputText = '';
      $scope.scrollDown = true;
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('im');
    });

  });
