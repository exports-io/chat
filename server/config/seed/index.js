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
    if (!error && users.length > 0) {
      var userSEQArr = [];
      _.forEach(users, function (val, key) {
        userSEQArr.push(val.SEQ);
      });

      Channel.find({}, function (er, channels) {
        if (!er && channels.length > 0) {
        }
        else if (channels.length === 0) {
          loadFile('channels.json').then(function (newChannels) {
            Channel.find({}).remove(function () {
              Channel.create(newChannels, function (err, success) {
                if (!err) console.log("DB SEED -- CHANNELS -- entered");

              })
            })
          })
        }
      });

      Im.find({}, function (err, ims) {
        if (!err && ims.length > 0) {
        }
        else if (ims.length === 0) {
          //loadFile('ims.json').then(function (newIms) {
          Im.find({}).remove(function () {
            var result = pairwise(userSEQArr);
            _.forEach(result, function (val) {
              Im.create({
                is_im: true,
                users: val,
                created: 123034123,
                is_user_deleted: Boolean
              }, function (err, succ) {
                if (!err) console.log("DB SEED -- IMS -- entered");
              });
            })
          });
          //})
        }
        else {
          console.log(err);
        }
      })
    }

    else if (!error && users.length === 0) {
      loadFile('users.json').then(function (newUsers) {
        console.log('success');
        User.find({}).remove(function () {
          User.create(newUsers, function (err, success) {
            if (!err)  console.log("DB SEED -- users -- entered");
          });
        });
      });
    }
    else {
      console.log(error);
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
