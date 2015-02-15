'use strict';

var User = require('../../api/user/user.model');
var Channel = require('../../api/channel/channel.model');
var Im = require('../../api/im/im.model');
var Chat = require('../../api/chat/chat.model');
var _ = require('lodash');
var q = require('q');
var fs = require('fs');
var path = require('path');

function seedDB() {

  User.find({}, function (error, users) {
    if (!error && users) {

      var userSEQArr = [];
      _.forEach(users, function (val, key) {
        userSEQArr.push(val.SEQ);
      });

      Channel.find({}, function (er, channels) {
        if (!er && channels) {
        }
        else if (!channels) {
          loadFile('channels.json').then(function (newChannels) {
            Channel.find({}).remove(function () {
              Channel.create(newChannels)
            })
          })
        }
      });

      Im.find({}, function (err, ims) {
        if (!err && ims) {
        }
        else if (!ims) {
          loadFile('ims.json').then(function (newIms) {
            Im.find({}).remove(function () {
              var result = pairwise(userSEQArr);
              _.forEach(result, function (val) {
                Im.create({
                  is_im: true,
                  users: val,
                  created: 123034123,
                  is_user_deleted: Boolean
                });
              })
            })
          })
        }
      })
    }

    else if (!users) {
      loadFile('users.json').then(function (newUsers) {
        User.find({}).remove(function () {
          User.create(newUsers);
        });
      });
    }
  });
}


seedDB();

function pairwise(list) {
  if (list.length < 2) {
    return [];
  }
  var first = list[0];
  var rest = list.slice(1);
  var pairs = rest.map(function (x) {
    return [first, x];
  });

  return pairs.concat(pairwise(rest));
}

function loadFile(filename) {
  var def = q.defer();
  var file = path.resolve(__dirname + '/' + filename);

  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    data = JSON.parse(data);
    def.resolve(data);
  });

  return def.promise;
}

/*
 User.find({}).remove(function () {
 User.create({
 provider: 'local',
 username: 'pbernasconi',
 name: 'Paolo Bernasconi',
 email: 'p@ex.io',
 password: 'pass'
 },
 {
 provider: 'local',
 username: 'marco_b',
 name: 'Marco Bernasconi',
 email: 'm@ex.io',
 password: 'pass'
 },
 {
 provider: 'local',
 role: 'admin',
 username: 'admin',
 name: 'Admin',
 email: 'admin@admin.com',
 password: 'admin'
 },
 function (error, success) {
 User.find({}, function (err, users) {

 var userSEQArr = [];
 _.forEach(users, function (val, key) {
 userSEQArr.push(val.SEQ);
 });

 Channel.find({}).remove(function () {
 Channel.create({
 name: "general",
 is_channel: true,
 created: new Date(),
 creator: "@paolo",
 is_archived: false,
 is_general: true,
 is_member: true,
 members: userSEQArr,
 purpose: {
 value: "general purpose",
 creator: "@paolo",
 last_set: 0
 },
 topic: {
 value: "topic value",
 creator: "@paolo",
 last_set: 0
 }
 },
 {
 name: "random",
 is_channel: true,
 created: new Date(),
 creator: "@paolo",
 is_archived: false,
 is_general: true,
 is_member: true,
 members: userSEQArr,
 purpose: {
 value: "random purpose",
 creator: "@paolo",
 last_set: 0
 },
 topic: {
 value: "random topic value",
 creator: "@paolo",
 last_set: 0
 }
 },
 function (error, success) {
 console.log('finished populating channels' + error);
 });
 });


 Im.find({}).remove(function () {
 var result = pairwise(userSEQArr);
 _.forEach(result, function (val) {
 Im.create({
 is_im: true,
 users: val,
 created: 123034123,
 is_user_deleted: Boolean
 });
 })
 });
 });
 }
 );
 });

 */
