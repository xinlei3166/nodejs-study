const fs = require('fs');

const rs = fs.createReadStream('files/file.txt', 'utf-8');

rs.on('data', function (chunk) {
    console.log('DATA');
    console.log(chunk)
});

rs.on('end', function () {
    console.log('END')
});

rs.on('error', function (err) {
    console.log('Error: ' + err)
});

const ws1 = fs.createWriteStream('files/output1.txt', 'utf-8');
ws1.write('使用Stream写入文本数据...\n');
ws1.write('END.');
ws1.end();

const ws2 = fs.createWriteStream('files/output2.txt');
ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
ws2.write(new Buffer('END.', 'utf-8'));
ws2.end();

const rs3 = fs.createReadStream('files/file.txt');
const ws3 = fs.createWriteStream('files/copy.txt');

rs3.pipe(ws3);
