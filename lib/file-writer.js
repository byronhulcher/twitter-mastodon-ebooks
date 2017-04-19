const fs = require('fs'),
  os = require('os');

module.exports.writeToFile = (filename, stringsToWrite) => {
  var writer = fs.createWriteStream(filename, {flags: 'a'});

  for (let stringToWrite of stringsToWrite) {
    writer.write(stringToWrite + os.EOL);
  }
  writer.end();
};
