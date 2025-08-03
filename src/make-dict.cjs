
function asdf() {

  var fs = require("fs");
  var text = fs.readFileSync("./array2.txt", 'utf8');
  var textByLine = text.split("\n");

  var file = fs.createWriteStream('./array6.txt');
  file.on('error', function (err) { /* error handling */ });
  textByLine.forEach(function (v) {
    if (v.length == 7)   file.write(v + "\n");
  });
  file.end();
}

asdf();
