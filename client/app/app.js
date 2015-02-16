(function () {
  'use strict';

  angular.module('chatApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'luegg.directives',
    'angular-spinkit'
  ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
      $urlRouterProvider.when('/', '/messages/general');
      $urlRouterProvider.otherwise('/messages/general');

      $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.path(), normalized = path.toLowerCase();
        if (path !== normalized) {
          return normalized;
        }
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

    .run(function ($rootScope, $location, $timeout, $state, Auth, socket) {
      $rootScope.connectedUsers = [];
      $rootScope.showLoading = true;

      var timeout;
      $rootScope.$on('$stateChangeStart', function (event, next) {
        $rootScope.showLoading = true;
        if (timeout) {
          $timeout.cancel();
        }
        timeout = $timeout(function () {
          $rootScope.showLoading = false;
        }, 1100);

        Auth.isLoggedInAsync(function (loggedIn) {
          if (next.authenticate && !loggedIn) {
            $location.path('/login');
            $rootScope.showLoading = false;
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
})();
