/* global io */
'use strict';

angular.module('chatApp')
  .factory('socket', function (socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  })

  .factory('ChatSocket', function (socketFactory) {
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    var watches = [],
      actions = [];

    var Action = function (modelName, arr, cb) {
      this.array = arr;
      this.cb = cb;
      this.modelName = modelName;

      // Bound Methods
      this.join = angular.bind(this, this.join);
      this.leave = angular.bind(this, this.leave);
      this.save = angular.bind(this, this.save);
      this.remove = angular.bind(this, this.remove);
    };

    Action.prototype = {
      sync: function () {
        socket.on(this.modelName + ':save', this.save);
        socket.on(this.modelName + ':remove', this.remove);
        socket.on('reconnect', this.join);
        return this.join();
      },
      unsync: function () {
        socket.removeListener(this.modelName + ':save', this.save);
        socket.removeListener(this.modelName + ':remove', this.remove);
        socket.removeListener('reconnect', this.join);
        return this.leave();
      },

      join: function () {
        socket.emit('join', this.modelName);
        return this;
      },
      leave: function () {
        socket.emit('leave', this.modelName);
        return this;
      },

      save: function (item) {
        var array = this.array;
        var oldItem = _.find(array, {_id: item._id});
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if (oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        this.cb(event, item, array);
      },
      remove: function (item) {
        var array = this.array;
        var event = 'deleted';
        _.remove(array, {_id: item._id});
        this.cb(event, item, array);
      }
    };

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        watches.push(array);
        actions.push(new Action(modelName, array, cb).sync());

      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param {Array} array
       */
      unsyncUpdates: function (array) {
        var index = watches.indexOf(array);
        if (index >= 0) {
          watches.splice(index, 1);
          actions.splice(index, 1)[0].unsync();
        }
      }
    };
  });
