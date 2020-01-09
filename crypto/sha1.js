const crypto = require('crypto');

const hash = crypto.createHash('sha1'); // 可替换为sha256

hash.update('Hello, World!');
hash.update('Hello, nodejs!');

console.log(hash.digest('hex'));
