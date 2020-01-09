const Koa = require('koa');
const WebSocket = require("koa-websocket");
const Cookies = require('cookies');
const url = require('url');
const bodyParser = require('koa-bodyparser');
const router = require('./controllers'); // 注意require('koa-router')返回的是函数:

app = WebSocket(new Koa());
wsClients = {};
wsUsers = [];

// parse user from cookie:
app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '');
    await next();
});

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

app.use(bodyParser())
app.use(router.routes())

function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}

var messageIndex = 0;

function createMessage(type, user, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

function broadcast(data) {
    for (let client of Object.values(wsClients)) {
        console.log(typeof client)
        console.log(client)
        client.send(data);
    }
}

function websocketHandler(ctx, next) {
    /* 每打开一个连接就往 上线文数组中 添加一个上下文 */
    let ws = ctx.websocket;
    let user = parseUser(ctx.cookies.get('name'));
    ws.on("message", (message) => {
        let location = url.parse(ctx.request.url, true);
        console.log('[WebSocketServer] connection: ' + location.href);
        if (location.pathname !== '/ws/chat') {
            ws.close(4000, 'Invalid URL');
        }
        if (!user) {
            ws.close(4001, 'Invalid user');
        }
        if (!wsClients[user.name]) {
            ws.user = user;
            wsClients[user.name] = ws
            wsUsers.push(user)
            let msg = createMessage('join', user, `${user.name} joined.`);
            broadcast(msg);
            let users = Array.from(wsUsers).map(function (user) {
                return user;
            });
            ws.send(createMessage('list', user, users));
        }

        if (message && message.trim()) {
            let msg = createMessage('chat', user, message.trim());
            broadcast(msg);
        }
    });

    ws.on("close", (message) => {
        /* 连接关闭时, 清理 上下文数组, 防止报错 */
        delete wsClients[user.name]
        wsUsers.splice(wsUsers.findIndex(x => x.name === user.name), 1)
        let msg = createMessage('left', user, `${user.name} is left.`);
        broadcast(msg);
    });
}

app.ws.use(websocketHandler);

app.listen(3000)
console.log('app started at port 3000...')

