const { readFile, stat, writeFile, spawn } = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

module.exports.readFile = promisify(readFile);
module.exports.writeFile = promisify(writeFile);
module.exports.stat = promisify(stat);
module.exports.exec = promisify(exec);