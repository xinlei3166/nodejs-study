const crypto = require('crypto');

function aesEncrypt(key, data, iv) {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted
}

function aesDecrypt(key, encrypted, iv) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
}

const data = 'Hello, this is a secret message!';
const key = 'Password!adadadd';
const iv = 'Password!adadadd';
const encrypted = aesEncrypt(key, data, iv);
const decrypted = aesDecrypt(key, encrypted, iv);

console.log('Plain text: ' + data);
console.log('Encrypted text: ' + encrypted);
console.log('Decrypted text: ' + decrypted);

