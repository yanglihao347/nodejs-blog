const fs = require('fs');
const path = require('path');

function writeLog(writeStream, log) {
    writeStream.write(log + '\n');
}

function createWriteStream(fileName) {
    const file = path.join(__dirname, '../', '../', 'logs', fileName);
    const writeStream = fs.createWriteStream(file, {
        flags: 'a'
    })
    return writeStream;
}

const accessWriteStream = createWriteStream('access.log')
function access(req, res) {
    const log = `${req.method} -- ${req.url} -- ${Date()} -- ${res}`;
    writeLog(accessWriteStream, log);
}

module.exports = {
    access,
}