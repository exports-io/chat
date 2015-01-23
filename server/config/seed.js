'use strict';

var User = require('../api/user/user.model');
var Channel = require('../api/channel/channel.model');

//Channel.find({}).remove(function () {
  Channel.create({
    name: "general",
    is_channel: true,
    created: new Date(),
    creator: "",
    is_archived: false,
    is_general: true,
    is_member: false,
    members: [""],
    purpose: {
      value: "a general channel",
      creator: "",
      last_set: 0
    },
    topic: {
      value: "topic value here",
      creator: "",
      last_set: 0
    },
    num_members: 0
  }, {
    name: "random",
    is_channel: true,
    created: new Date(),
    creator: "",
    is_archived: false,
    is_general: true,
    is_member: false,
    members: [""],
    purpose: {
      value: "a general channel",
      creator: "",
      last_set: 0
    },
    topic: {
      value: "topic value here",
      creator: "",
      last_set: 0
    },
    num_members: 0
  });

//});

User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    name: 'Paolo Bernasconi',
    email: 'p@ex.io',
    password: 'pass'
  },
  {
    provider: 'local',
    name: 'Marco Bernasconi',
    email: 'm@ex.io',
    password: 'pass'
  },
  {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function () {
    console.log('finished populating users');
  }
);

