const router = require('koa-router')()

const home = require('./home')(router)
const login = require('./login')(router)

router.use(home.routes(), home.allowedMethods())
router.use(login.routes(), login.allowedMethods())
// router.use('/api', api.routes(), api.allowedMethods())

module.exports = router
