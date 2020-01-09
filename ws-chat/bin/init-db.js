const model = require('../utils/model.js');
new Promise(model.sync).then(function () {
    console.log('init db ok.');
    process.exit(0);
});
// model.sequelize.sync().then(() => { console.log('init db ok.'); process.exit(0); }).catch((e) => { console.log(`failed:${e}`); process.exit(0); });

