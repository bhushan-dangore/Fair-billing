const fs = require("fs");
const { EOL } = require("os");

const logLineFromat = /[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\s(\w)*\s(Start|End)/i;
function validateLine(line) {
  return logLineFromat.test(line);
}

function convertLineToObject(line) {
  const splitLine = line.split(" ");
  return {
    time: splitLine[0],
    name: splitLine[1],
    event: splitLine[2],
  };
}

function readLogFile(path) {
  return new Promise((resolve, reject) => {
    if (!path) reject("Please provide file path");

    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject("Provided path to file is invalid");
        return;
      }
      return resolve(
        data.split(EOL).filter(validateLine).map(convertLineToObject)
      );
    });
  });
}

module.exports = {
  readLogFile,
};
