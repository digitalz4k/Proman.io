'use strict';

// Server Setup ====================================================================
var express = require('express'),
            app = express(),
            port    = process.env.PORT || 3000,
            path = require('path'),
            http    = require('http'),
    fs = require('fs'),
    mongoose = require('mongoose');

// Database Configuration =============================================================
var config = require('./server/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

var modelsPath = path.join(__dirname, '/server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Express Configuration ===============================================================
var app = express();
require('./server/config/express')(app);
require('./server/routes/routes')(app);

// Launch server ====================================================================
app.listen(config.port, config.ip, function () {
  console.log('Client and Web API server launched on %s:%d', config.ip, config.port);
});

// Expose ==========================================================================
exports = module.exports = app;