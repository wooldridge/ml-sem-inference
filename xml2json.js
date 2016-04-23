var parser = require('xml2json'),
    fs = require('fs');

var xml = fs.readFileSync('gutenberg/gutenberg_1-100-2.xml', {encoding: 'utf8'});

var json = parser.toJson(xml);

console.log(json);

fs.writeFileSync('gutenberg/gutenberg_1-100-3.xml', json, {encoding: 'utf8'})
