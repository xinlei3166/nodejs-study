function router(router) {
    router.get('/', async (ctx, next) => {
        ctx.render('index.njk', {
            title: 'Welcome'
        });
    })
    return router
}
module.exports = router;
