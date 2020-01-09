const
    app = require('../app').listen(9900),
    request = require('supertest')(app)

describe('#test koa app', () => {

    it('#test GET /', async () => {
        await request.get('/').expect('Content-Type', /text\/html/).expect(200);
    });

    it('#test GET /404', async () => {
        await request.get('/404').expect('Content-Type', /text\/plain/).expect(404);
    });
});
