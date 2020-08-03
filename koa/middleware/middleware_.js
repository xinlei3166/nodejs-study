const compose = require('koa-compose')
const dayjs = require('dayjs')
const errorCode = require('../exception/error-code')

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
const { checkToken } = require('../utils/decorator')

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
  return next().catch(err => {
    console.error(dayjs().format('YYYY-MM-DD HH:mm:ss'), err)
    if (err.output.statusCode === 405) {
      ctx.error(errorCode.MethodNotAllowed.code, errorCode.MethodNotAllowed.msg)
    } else {
      throw err
    }
  })
}

module.exports = compose([
  logger,
  responseTime,
  bodyParser,
  response,
  errorRequestMethod,
  checkToken,
  router
])
