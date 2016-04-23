var config = require('./config'),
    marklogic = require('marklogic');

var args = process.argv;

if (args.length < 3) {
  console.log('Usage: node predicate <predicate_name>');
  process.exit(0);
}

var db = marklogic.createDatabaseClient({
  host: config.host,
  port: config.database.port,
  user: config.auth.user,
  password: config.auth.pass,
  authType: 'digest'
});

var query  = 'SELECT ?subj ?pred ?obj ';
    query += 'WHERE { ';
    query += '   ?subj ?pred ?obj FILTER(?pred=<' + args[2] + '>) .';
    query += '}';

db.graphs.sparql({
  contentType: 'application/sparql-results+json',
  query: query,
  rulesets: 'subPropertyOf.rules'
}).result(function (result) {
  console.log(JSON.stringify(result.results.bindings, null, 2));
}, function(error) {
  console.log(JSON.stringify(error, null, 2));
});;
