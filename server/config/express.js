'use strict';

var express = require('express'),
    session = require('express-session'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    cors = require('cors'),
    config = require('./config'),
    moment = require('moment');


/**
 * Express configuration
 */
module.exports = function(app) {
    app.use(cors());
    app.use(favicon());
    app.use(express.static(path.join(config.root, 'app')));
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded()); // get information from html forms
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(session({secret: 'keyboard cat',
                            cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
                            saveUninitialized: true,
                            resave: true}));
    app.use(methodOverride());
    app.use(logger('dev')); // log every request to the console
};