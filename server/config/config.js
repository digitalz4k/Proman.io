'use strict';

var _ = require('lodash');

module.exports = _.merge(
    require('./database/dbinfo.js'),
    require('./database/db') || {});