const crypto = require('crypto');

const ming = crypto.createDiffieHellman(512);
const ming_keys = ming.generateKeys();

const prime = ming.getPrime();
const generator = ming.getGenerator();

console.log('Prime: ' + prime.toString('hex'));
console.log('Generator: ' + generator.toString('hex'));

const hong = crypto.createDiffieHellman(prime, generator);
const hong_keys = hong.generateKeys();

const ming_secret = ming.computeSecret(hong_keys);
const hong_secret = hong.computeSecret(ming_keys);

console.log('Secret of Xiao Ming: ' + ming_secret.toString('hex'));
console.log('Secret of Xiao Hong: ' + hong_secret.toString('hex'));
