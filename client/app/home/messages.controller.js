'use strict';

angular.module('chatApp')
  .controller('SidebarCtrl', function ($scope, $rootScope, $http, $state, $stateParams, $modal, $timeout, socket, Auth) {
    // $scope.activeChannel = "general";
    $scope.drawerOpen = false;

    $rootScope.currentUser = $scope.currentUser = Auth.getCurrentUser();


    $http.get('/api/users/').success(function (results) {
      $scope.users = results;
    });

    $http.get('/api/channels/').success(function (results) {
      $scope.channels = results;
      socket.syncUpdates('channel', $scope.channels);
    });

    $scope.switchChannel = function (channel) {
      $state.go('index.messages', {channel: channel.name});
      $scope.activeChannel = channel.name
    };

    $scope.switchIM = function (user) {
      $state.go('index.messages', {channel: '@' + user.name})
    };

    $scope.openDrawer = function () {
      $scope.drawerOpen = $scope.drawerOpen ? false : true;
    };

    $scope.logout = function () {
      Auth.logout();
      $state.go('login');
    };

    $scope.createNewChannel = function () {
      $scope.modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'medium',
        scope: $scope,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      $scope.modalInstance.result.then(function (channel) {
        $http.post('/api/channels', channel).then(function (success) {
          // console.log(success);
        }, function (error) {
          // console.log(error);
        });
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
    };
  })

  .controller('ContentCtrl', function ($scope, $rootScope, $http, $state, $timeout, $stateParams, socket) {
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
      console.log(data);
    });

    socket.socket.on('isNotTyping', function () {
      $scope.isTyping = false;
    });

    $scope.$on('$destroy', function () {
      socket.socket.emit('leave', {channel: $scope.channelName});
      socket.unsyncUpdates('chat');
    });

  })

  .controller('ModalInstanceCtrl', function ($scope, $rootScope, $http, socket) {

    $scope.newChannel = {
      name: '',
      purpose: {
        value: ''
      },
      creator: $rootScope.currentUser._id,
      is_archived: false,
      is_general: false,
      is_member: true,
      created: new Date()
    };

    $scope.ok = function () {
      $scope.modalInstance.close($scope.newChannel);
    };

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };
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
