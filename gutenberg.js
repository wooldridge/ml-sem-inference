var config = require('./config'),
    rp = require('request-promise'),
    marklogic = require('marklogic'),
    fs = require('fs');

var transformsPath = config.path + 'transforms/'
    transformsFiles = fs.readdirSync(transformsPath),
    count = 0;

var name = 'gutenberg.xsl';

function loadTransform() {

  // var currFile = transformsFiles.shift();
  // count++;
  // var transform;
  transform = fs.readFileSync(transformsPath + name, {encoding: 'utf8'});

  var db = marklogic.createDatabaseClient({
    host: config.host,
    port: config.database.port,
    user: config.auth.user,
    password: config.auth.pass,
    authType: 'digest'
  });

  db.config.transforms.write({
    name: name,
    format: 'xslt',
    source: transform
  }).result(
    function(response) {
      console.log('Transform loaded');
      loadData();
    },
    function(error) { console.log(JSON.stringify(error)); }
  );

}

var dataPath = config.path + 'gutenberg/'
    dataFiles = fs.readdirSync(dataPath),
    count = 0;

function loadData() {
  // var currFile = dataFiles.shift();
  // count++;
  // var buffer;
  buffer = fs.readFileSync(dataPath + 'gutenberg_1-100.xml');

  var options = {
    method: 'PUT',
    uri: 'http://' + config.host + ':' + config.restSetup["rest-api"]["port"] + '/v1/documents?database=' + config.databaseSetup["database-name"] + '&uri=/' + 'gutenberg.xml' + '&transform=' + name,
    body: buffer,
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('Data loaded');
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

function start() {
  loadTransform();
}

start();
