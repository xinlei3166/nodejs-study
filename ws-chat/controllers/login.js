let index = 0;

module.exports = function (router) {
    router.get('/signin', async (ctx, next) => {
        let names = ['段誉', '乔峰', '虚竹', '王语嫣', '阿紫', '钟灵儿', '慕容复', '甘宝宝', '梦姑', '李秋水'];
        let name = names[index % 10];
        ctx.render('signin.njk', {
            name: `${name}`
        });
    })

    router.post('/signin', async (ctx, next) => {
        index ++;
        let name = ctx.request.body.name || '段誉';
        let user = {
            id: index,
            name: name,
            image: index % 10
        };
        let value = Buffer.from(JSON.stringify(user)).toString('base64');
        console.log(`Set cookie value: ${value}`);
        ctx.cookies.set('name', value);
        ctx.response.redirect('/');
    })

    router.get('/signout', async (ctx, next) => {
        ctx.cookies.set('name', '');
        ctx.response.redirect('/signin');
    })

    return router
}
