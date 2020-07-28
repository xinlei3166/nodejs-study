const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./controllers'); // 注意require('koa-router')返回的是函数
const rest = require('./rest/rest')
const Boom = require('@hapi/boom')
const dayjs = require('dayjs')

// logger
const logger = require('koa-logger')
app.use(logger());

// 模版
const isProduction = require('./settings/env');
const template = require('./utils/template');
app.use(template(__dirname + '/views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// 静态文件
if (!isProduction) {
    const staticFiles = require('./utils/static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

app.use(rest.restify())

app.use(bodyParser())
app.use(router.routes())

// router boom
app.use(
  router.allowedMethods({
      throw: true,
      notImplemented: () => new Boom.notImplemented(),
      methodNotAllowed: () => new Boom.methodNotAllowed()
  })
)

app.on('error', err => {
    //捕获异常记录错误日志
    console.error(dayjs().format('YYYY-MM-DD HH:mm:ss'), err)
})

module.exports = app;

