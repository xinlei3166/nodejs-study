const fs = require('fs');
const path = require('path');
const db = require('./db');
const BASE_DIR = require('../settings').BASE_DIR

let files = fs.readdirSync(BASE_DIR + '/models');

let js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    let name = f.substring(0, f.length - 3);
    console.log(`import ${name} from file ${f}...`);
    module.exports[name] = require(BASE_DIR + '/models/' + name);
}

module.exports.sync = () => {
    db.sync();
};
