'use strict';

angular.module('chatApp')

  .service('Channel', function ($resource) {
    return $resource('api/channels/:name', {}, {
      get: {method: 'GET'},
      post: {method: 'POST'}
    }).$promise;
  });
