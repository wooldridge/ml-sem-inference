var config = require('./config'),
    marklogic = require('marklogic');

var db = marklogic.createDatabaseClient({
  host: config.host,
  port: config.database.port,
  user: config.auth.user,
  password: config.auth.pass,
  authType: 'digest'
});

var query  = 'SELECT ?s ';
    query += 'WHERE { ';
    query += '   ?s <http://example.org/ontology/creator> ?o .';
    query += '   ?s ?p ?o .';
    query += '}';

db.graphs.sparql({
  contentType: 'application/sparql-results+json',
  query: query,
  rulesets: 'equivalentProperty.rules'
}).result(function (result) {
  console.log(JSON.stringify(result.results, null, 2));
}, function(error) {
  console.log(JSON.stringify(error, null, 2));
});;
