const fs = require('fs');

fs.readFile('files/file.txt', 'utf-8', function (err, data) {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
    }
});

// fs.readFile('files/img.jpeg', function (err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//         const text = data.toString('utf-8');
//         console.log(text);
//         console.log(data.length + ' bytes');
//     }
// });

try {
    const data = fs.readFileSync('files/output.txt', 'utf-8');
    console.log(data);
} catch (err) {
    console.log(err)
}

const data = 'Hello, Node.js';
fs.writeFile('files/output.txt', data, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('ok.');
    }
});

// const data1 = 'Hello, Node.js';
// fs.writeFileSync('files/output1.txt', data1);

fs.stat('files/file.txt', function (err, stat) {
    if (err) {
        console.log(err);
    } else {
        // 是否是文件:
        console.log('isFile: ' + stat.isFile());
        // 是否是目录:
        console.log('isDirectory: ' + stat.isDirectory());
        if (stat.isFile()) {
            // 文件大小:
            console.log('size: ' + stat.size);
            // 创建时间, Date对象:
            console.log('birth time: ' + stat.birthtime);
            // 修改时间, Date对象:
            console.log('modified time: ' + stat.mtime);
        }
    }
});
