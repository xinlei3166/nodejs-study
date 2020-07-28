const compose = require('koa-compose')
const dayjs = require('dayjs')

// logger
const _logger = require('koa-logger')
const logger = _logger(str => {
  console.log(dayjs().format('YYYY-MM-DD HH:mm:ss') + str)
})

// responseTime
const responseTime = async (ctx, next) => {
  let start = new Date().getTime(),
    execTime
  await next()
  execTime = new Date().getTime() - start
  ctx.response.set('X-Response-Time', `${execTime}ms`)
}

// body parser
const bodyParser = require('koa-bodyparser')()

// router
const _router = require('../controllers') // 注意require('koa-router')返回的是函数:
const router = _router.routes()

// check token
const errorCode = require('../exception/error-code')
const unless = require('../constant').unless
const token = require('../utils/token')
const hashidDecode = require('../utils/utils').hashidDecode
const collections = require('../constant').collections
const settings = require('../settings')

const checkToken = async (ctx, next) => {
  if (!unless.includes(ctx.url)) {
    let accessToken = ctx.request.headers.authorization
    if (!accessToken) {
      return ctx.error(errorCode.MissingToken.code, errorCode.MissingToken.msg)
    }

    if (!accessToken.startsWith('Bearer ')) {
      return ctx.error(
        errorCode.TokenFormatError.code,
        errorCode.TokenFormatError.msg
      )
    }

    accessToken = accessToken.split(' ')[1]

    const revokeAccessToken = await ctx.db.findOne(collections.RevokeToken, {
      key: 'accessToken_' + accessToken
    })
    if (revokeAccessToken) {
      return ctx.error(errorCode.TokenRevoke.code, errorCode.TokenRevoke.msg)
    }

    try {
      const payload = token.decode(settings.SECRET_KEY, accessToken)

      const tokenType = payload.tokenType
      if (tokenType !== 'accessToken') {
        return ctx.error(errorCode.InvalidTokenError.code, '不合法的token type')
      }

      const sub = hashidDecode(payload.sub)
      const user = await ctx.db.findOne(collections.User, {
        uidNumber: String(sub)
      })
      if (!user) {
        return ctx.error(errorCode.InvalidTokenError.code, '不合法的token sub')
      } else {
        ctx.request.sub = String(sub)
      }
    } catch (e) {
      const { code, msg } = e
      return ctx.error(code, msg)
    }
  }
  await next()
}

// return response
const response = async (ctx, next) => {
  ctx.success = function(msg, data) {
    ctx.type = 'json'
    ctx.body = {
      code: 200,
      msg: msg || '请求成功',
      data: data
    }
  }

  ctx.error = function(code, msg) {
    ctx.type = 'json'
    ctx.body = {
      code: code || 400,
      msg: msg || '请求失败'
    }
  }

  await next()
}

// error request method
const errorRequestMethod = async (ctx, next) => {
  next().catch(err => {
    console.error(dayjs().format('YYYY-MM-DD HH:mm:ss'), err)
    if (err.output.statusCode === 405) {
      ctx.error(errorCode.MethodNotAllowed.code, errorCode.MethodNotAllowed.msg)
    }
  })
}

module.exports = compose([
  logger,
  responseTime,
  bodyParser,
  response,
  checkToken,
  router,
  errorRequestMethod
])
