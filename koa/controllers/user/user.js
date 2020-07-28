const collections = require('../constant').collections
const errorCode = require('../exception/error-code')

module.exports = function(router) {
  router.get('/api/users/me', async ctx => {
    const user = await ctx.db.findOne(collections.User, {
      uidNumber: ctx.request.sub
    })
    const data = {
      email: user.email,
      name: user.name,
      cn: user.cn,
      title: user.title,
      avatar:
        user.avatar ||
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2879737833,3886875511&fm=26&gp=0.jpg'
    }
    ctx.success(errorCode.Success.msg, data)
  })

  return router
}
