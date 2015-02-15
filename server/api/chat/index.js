'use strict';

var express = require('express');
var controller = require('./chat.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:SEQ', controller.show);
router.get('/query/:query', controller.query);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
