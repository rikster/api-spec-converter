'use strict';

var FS = require('fs');
var Request = require('request');
var YAML = require('yamljs');
var _ = require('lodash');
var URI = require('URIjs');

module.exports.parseJSON = function (data, callback) {
  var json;
  try {
    json = JSON.parse(data);
  } catch(e) {
    callback(Error('JSON: ' + e));
    return;
  }
  callback(null, json);
};

module.exports.parseYAML = function (data, callback) {
  var yaml;
  try {
    yaml = YAML.parse(data);
  } catch(e) {
    callback(Error('YAML: ' + e));
    return;
  }
  callback(null, yaml);
};

function readUrl(url, callback) {
  new Request(url, function(err, response, data) {
    //TODO: check if status 200
    callback(err, data);
  });
}

function readFile(filename, callback) {
  FS.readFile(filename, 'utf8', callback);
}

function readDummy(data, callback) {
  callback(null, data);
}

module.exports.resourceReaders = {
  url: readUrl,
  file: readFile,
  object: readDummy,
  string: readDummy,
};

module.exports.getSourceType = function (source) {
  if (_.isObject(source))
    return 'object';
  if (!_.isString(source))
    return undefined;

  var uri = new URI(source);
  if (uri.is('absolute'))
    return 'url';
  else if (uri.is('relative'))
    return 'file';
  else
    return 'string';
};