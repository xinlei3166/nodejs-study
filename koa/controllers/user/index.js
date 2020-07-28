const router = require('koa-router')()

const login = require('./login')(router)
const user = require('./user')(router)

router.use(login.routes(), login.allowedMethods())
router.use(user.routes(), user.allowedMethods())

module.exports = router
