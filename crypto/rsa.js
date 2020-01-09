const crypto = require('crypto');
const fs = require('fs');


class Rsa {
    constructor(privateFile, publicFile) {
        this.privateKey = this.loadKey(privateFile);
        this.publicKey = this.loadKey(publicFile);
    }

    // 从文件加载key
    loadKey(file) {
        // key实际上就是PEM编码的字符串:
        return fs.readFileSync(file, 'utf8');
    }

    // 使用私钥加密
    privateEncrypt(data) {
        return crypto.privateEncrypt(this.privateKey, Buffer.from(data, 'utf8'));
    }

    // 使用公钥解密
    publicDecrypt(encrypted) {
        return crypto.publicDecrypt(this.publicKey, encrypted);
    }

    // 使用公钥加密
    publicEncrypt(data) {
        return crypto.publicEncrypt(this.publicKey, Buffer.from(data, 'utf8'));
    }

    // 使用私钥解密
    privateDecrypt(encrypted) {
        return crypto.privateDecrypt(this.privateKey, encrypted);
    }

    // to hex
    toHex(data) {
        return data.toString('hex');
    }

    // to utf8
    toUtf8(data) {
        return data.toString('utf8')
    }

    encrypt(data) {
        return this.publicEncrypt(data);
    }

    decrypt(encrypted) {
        return this.privateDecrypt(encrypted);
    }
}


const
    privateFile = 'keyfiles/private.pem',
    publicFIle = 'keyfiles/public.pem',
    message = 'Hello, World!';

const rsa = new Rsa(privateFile, publicFIle);

// 私钥加密，公钥解密
// const encrypted = rsa.privateEncrypt(message);
// const decrypted = rsa.publicDecrypt(encrypted);
// console.log('encrypted by private key: ' + encrypted.toString('hex'));
// console.log('decrypted by public key: ' + decrypted.toString('utf8'));

// 公钥加密，私钥解密
const encrypted = rsa.publicEncrypt(message);
const decrypted = rsa.privateDecrypt(encrypted);
console.log('encrypted by private key: ' + encrypted.toString('hex'));
console.log('decrypted by public key: ' + decrypted.toString('utf8'));

