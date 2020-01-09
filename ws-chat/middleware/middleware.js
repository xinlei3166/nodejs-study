const compose = require('koa-compose');

// logger and response time
const logger = async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    let
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
}

// 配置静态文件解析
const _staticFiles = require('./utils/static-files');
const staticFiles = _staticFiles('/static/', __dirname + '/static');

// 配置模版解析
const _template = require('./utils/template');
const isProduction = require('./settings/env');
const template = _template('views', {
    noCache: !isProduction,
    watch: !isProduction
});

// body parser
const _bodyParser = require('koa-bodyparser');
const bodyParser = _bodyParser();

// router
const _router = require('./controllers'); // 注意require('koa-router')返回的是函数:
const router = _router.routes();

const middlewares = compose(
    [
        logger,
        staticFiles,
        template,
        bodyParser,
        router
    ]);

module.exports = middlewares
