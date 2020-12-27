const redisClient = require('../bin/www').redisClient;
var express = require('express');
var router = express.Router();
var rclient;

/* GET users listing. */
router.get('/', function(req, res, next) {
  rclient.set('world','hello');
  res.send('respond with a resource');
});

module.exports = {
  router,
  setClient : function(inClient){
    rclient = inClient;
  }
}
