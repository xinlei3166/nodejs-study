module.exports = function (router) {
    router.get('/product', async (ctx, next) => {
        ctx.render('product.njk');
    })
    return router
}
