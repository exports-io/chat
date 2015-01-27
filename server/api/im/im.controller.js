'use strict';

var _ = require('lodash');
var Im = require('./im.model');

// Get list of ims
exports.index = function (req, res) {
  Im.find(function (err, ims) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, ims);
  });
};

// Get a single im
exports.show = function (req, res) {
  Im.find({SEQ: req.params.SEQ}, function (err, im) {
    if (err) {
      return handleError(res, err);
    }
    if (!im) {
      return res.send(404);
    }
    return res.json(im);
  });
};

// Creates a new im in the DB.
exports.create = function (req, res) {
  Im.create(req.body, function (err, im) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, im);
  });
};

// Updates an existing im in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Im.findById(req.params.id, function (err, im) {
    if (err) {
      return handleError(res, err);
    }
    if (!im) {
      return res.send(404);
    }
    var updated = _.merge(im, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, im);
    });
  });
};

// Deletes a im from the DB.
exports.destroy = function (req, res) {
  Im.findById(req.params.id, function (err, im) {
    if (err) {
      return handleError(res, err);
    }
    if (!im) {
      return res.send(404);
    }
    im.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
