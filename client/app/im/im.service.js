'use strict';

angular.module('chatApp')

  .factory('ImAPI', function ($http) {

    return {
      open: function (currentUser, otherUser) {
        return $http({
          url: 'api/ims/open/',
          method: 'POST',
          params: {
            currentUser: currentUser,
            otherUser: otherUser
          }
        });
      },
      users: function (user1, user2) {
        return $http({
          url: 'api/ims/users/',
          method: 'GET',
          params: {
            users: user1,
            them: user2
          }
        });
      },
      list: function () {
        return $http({
          url: 'api/ims/list/',
          method: 'GET'
        });
      }
    }
  })

  .service('UserAPI', function ($resource) {
    return $resource('api/users/:id/username/:username', {}, {
      getAll: {method: 'GET', isArray: true},
      getWithUsername: {method: 'GET', isArray: true, params: {username: '@username'}},
      post: {method: 'POST'}
    })
  });
