module.exports = function (router) {
    router.get('/hello/:name', async (ctx, next) => {
        const name = ctx.params.name;
        ctx.response.body = `<h1>Hello, ${name}!</h1>`;
        ctx.redirect('/index')
    })
    return router
}
