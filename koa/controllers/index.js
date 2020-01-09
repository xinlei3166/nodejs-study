const router = require('koa-router')()

const home = require('./home')(router)
const login = require('./login')(router)
const hello = require('./hello')(router)
const product = require('./product')(router)
const api = require('./api')(router)

router.use(home.routes(), home.allowedMethods())
router.use(login.routes(), login.allowedMethods())
router.use(hello.routes(), hello.allowedMethods())
router.use(product.routes(), product.allowedMethods())
router.use(api.routes(), api.allowedMethods())

module.exports = router
