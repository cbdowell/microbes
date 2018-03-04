'use strict';

var bunyan = require('bunyan');
var bunyanFormat = require('bunyan-format');
var formatOut = bunyanFormat({ outputMode: 'short' });

var index = bunyan.createLogger({ name: 'microbes', stream: formatOut, level: 'debug' });

module.exports = index;
