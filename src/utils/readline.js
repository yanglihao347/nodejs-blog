const fs = require('fs');
const path = require('path');
const readline = require('readline');


const logFile = path.join(__dirname, '../', '../', 'logs', 'access.log');

const readStream = fs.createReadStream(logFile);

const rl = readline.createInterface({
    input: readStream
});

rl.on('line', lineData => {
    if (!lineData) {
        return;
    }
    // 在这里进行日志的处理分析
    console.log(lineData, '======lineData');
})
