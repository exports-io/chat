'use strict';

angular.module('chatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'luegg.directives'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/messages/general');

    /*
     $urlRouterProvider.when(/messages\/[@]+/i, ['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
     //console.log($stateParams);
     //$state.go('index.im', {im: $rootScope.stateParam})
     }]);

     */

    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path(), normalized = path.toLowerCase();
      if (path != normalized) return normalized;
    });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, socket) {
    $rootScope.connectedUsers = [];

    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

    socket.socket.emit('userConnected', Auth.getCurrentUser());

    socket.socket.on('newUserConnected', function (user) {
      $rootScope.connectedUsers.push(user);
      //console.log($rootScope.connectedUsers);
    });

    socket.socket.on('userDisconnected', function () {
      $rootScope.connectedUsers.pop();
      //console.log($rootScope.connectedUsers);
    });
  });
