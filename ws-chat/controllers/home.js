function router(router) {
    router.get('/', async (ctx, next) => {
        let user = ctx.state.user;
        if (user) {
            ctx.render('room.njk', {
                user: user
            });
        } else {
            ctx.response.redirect('/signin');
        }
    })
    return router
}
module.exports = router;
