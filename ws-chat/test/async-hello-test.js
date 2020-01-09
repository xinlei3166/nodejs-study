const assert = require('assert')
const hello = require('./async-hello')

it('#async function', async () => {
    let r = await hello();
    assert.strictEqual(r, 15);
});
