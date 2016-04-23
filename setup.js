var config = require('./config'),
    rp = require('request-promise'),
    marklogic = require('marklogic'),
    fs = require('fs');

function createDatabase() {
  var options = {
    method: 'POST',
    uri: 'http://' + config.host + ':8002/manage/v2/databases',
    body: config.databaseSetup,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('Database created: ' + config.databaseSetup["database-name"]);
      getHost();
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

var hostName = '';

function getHost() {
  var options = {
    method: 'GET',
    uri: 'http://' + config.host + ':8002/manage/v2/hosts',
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      hostName = parsedBody['host-default-list']['list-items']['list-item'][0].nameref;
      console.log('Host name: ' + hostName);
      createForest(hostName);
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

function createForest(hostName) {
  config.forestSetup["host"] = hostName;
  var options = {
    method: 'POST',
    uri: 'http://' + config.host + ':8002/manage/v2/forests',
    body: config.forestSetup,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('Forest created and attached: ' + config.forestSetup["forest-name"]);
      createREST();
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

function createREST() {
  var options = {
    method: 'POST',
    uri: 'http://' + config.host + ':8002/v1/rest-apis',
    body: config.restSetup,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('REST instance created at port: ' + config.restSetup["rest-api"]["port"]);
      loadTransforms();
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

var transformsPath = config.path + 'transforms/'
    transformsFiles = fs.readdirSync(transformsPath),
    count = 0;

function loadTransforms() {

  var currFile = transformsFiles.shift();
  count++;
  var transform;
  transform = fs.readFileSync(transformsPath + currFile, {encoding: 'utf8'});

  var db = marklogic.createDatabaseClient({
    host: config.host,
    port: config.database.port,
    user: config.auth.user,
    password: config.auth.pass,
    authType: 'digest'
  });

  db.config.transforms.write({
    name: currFile,
    format: 'xslt',
    source: transform
  }).result(
    function(response) {
      if (transformsFiles.length > 0) {
        loadTransforms();
      } else {
        console.log('Transforms loaded');
        loadData();
      }
    },
    function(error) { console.log(JSON.stringify(error)); }
  );

}

var dataPath = config.path + 'books/'
    dataFiles = fs.readdirSync(dataPath),
    count = 0;

function loadData() {
  var currFile = dataFiles.shift();
  count++;
  var buffer;
  buffer = fs.readFileSync(dataPath + currFile);

  var options = {
    method: 'PUT',
    uri: 'http://' + config.host + ':' + config.restSetup["rest-api"]["port"] + '/v1/documents?database=' + config.databaseSetup["database-name"] + '&uri=/' + currFile + '&transform=book.xsl',
    body: buffer,
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('Document loaded: ' + currFile);
      if (dataFiles.length > 0) {
        loadData();
      } else {
        console.log('Data loaded');
        loadTriples();
      }
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

var triplesPath = config.path + 'triples/'
    triplesFiles = fs.readdirSync(triplesPath),
    count = 0;

function loadTriples() {

  var currFile = triplesFiles.shift();
  count++;
  var buffer;
  buffer = fs.readFileSync(triplesPath + currFile);

  var db = marklogic.createDatabaseClient({
    host: config.host,
    port: config.database.port,
    user: config.auth.user,
    password: config.auth.pass,
    authType: 'digest'
  });

  db.graphs.write({
    contentType: 'application/rdf+json',
    data: buffer
  }).result(
    function(response) {
      if (triplesFiles.length > 0) {
        loadTriples();
      } else {
        console.log('Triples loaded');
        loadRules();
      }
    },
    function(error) { console.log(JSON.stringify(error)); }
  );

}

var rulesPath = config.path + 'rules/'
    rulesFiles = fs.readdirSync(rulesPath),
    count = 0;

function loadRules() {

  var currFile = rulesFiles.shift();
  count++;
  var buffer;
  buffer = fs.readFileSync(rulesPath + currFile);

  var db = marklogic.createDatabaseClient({
    host: config.host,
    port: config.database.port,
    database: 'Schemas',
    user: config.auth.user,
    password: config.auth.pass,
    authType: 'digest'
  });

  db.documents.write({
    uri: '/' + currFile,
    content: buffer
  }).result(
    function(response) {
      if (rulesFiles.length > 0) {
        loadRules();
      } else {
        console.log('Rules loaded');
      }
    },
    function(error) { console.log(JSON.stringify(error)); }
  );

}


function start() {
  createDatabase();
}

start();
