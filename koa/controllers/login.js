module.exports = function (router) {
    router.post('/signin', async (ctx, next) => {
        const
            name = ctx.request.body.name || '',
            password = ctx.request.body.password || '';
        console.log(`signin with name: ${name}, password: ${password}`);
        if (name === 'koa' && password === '123456') {
            ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        } else {
            ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
        }
    })

    router.get('/login', async (ctx, next) => {
        ctx.render('login.njk');
    })

    router.post('/login', async (ctx, next) => {
        var
            name = ctx.request.body.name || '',
            password = ctx.request.body.password || '';
        if (name === 'node' && password === '123456') {
            // 登录成功:
            ctx.render('login-success.njk', {
                title: 'Login In Success',
                name: 'Node'
            });
        } else {
            console.log(ctx.request.body)
            // 登录失败:
            ctx.render('login-failed.njk', {
                title: 'Login In Failed'
            });
        }
    })

    return router
}
