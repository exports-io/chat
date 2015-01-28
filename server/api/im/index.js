'use strict';

var express = require('express');
var controller = require('./im.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/seq/:SEQ', controller.show);
router.get('/users/', controller.users);
router.get('/list/', controller.list);
router.post('/open/', controller.open);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
