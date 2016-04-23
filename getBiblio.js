var fs = require('fs'),
    rp = require('request-promise');

var text = fs.readFileSync('gutenberg/gutenberg_1-100-2.json', {encoding: 'utf8'});

var json = JSON.parse(text);

var books = json.books.book;

function getBiblio (uri) {
  var options = {
    method: 'GET',
    uri: uri,
  };
  rp(options)
    .then(function (result) {
      console.log(result);
      var filename = uri.split(/\//).pop();
      fs.writeFileSync('gutenberg/' + filename, result, {encoding: 'utf8'})
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

var book = books.shift();
console.dir(book);
getBiblio(book.url);

// json.books.book.forEach(function (book) {
//   console.log(book.url);
//   //fs.writeFileSync('gutenberg/gutenberg_1-100-3.xml', json, {encoding: 'utf8'})
//   var options = {
//     method: 'GET',
//     uri: book.url,
//   };
//   rp(options)
//     .then(function (result) {
//       console.log(result);
//       //fs.writeFileSync('gutenberg/gutenberg_1-100-3.xml', json, {encoding: 'utf8'})
//     })
//     .catch(function (err) {
//       console.log(JSON.stringify(err, null, 2));
//     });
//   return;
// });
