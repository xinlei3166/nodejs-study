const path = require('path');

const settings = {
    BASE_DIR: path.resolve(__dirname, '..')
}

const development = {
    db: {
        dialect: 'mysql',   // 数据库
        name: 'test', // 数据库名称
        username: 'test', // 用户名
        password: '123456', // 口令
        host: 'localhost', // 主机名
        port: 3306, // 端口号，MySQL默认3306
        timezone: '+08:00'
    }
}

const test = {
    db: {
        name: 'test', // 使用哪个数据库
        username: 'test', // 用户名
        password: '123456', // 口令
        host: 'localhost', // 主机名
        port: 3306, // 端口号，MySQL默认3306
        timezone: '+08:00'
    }
}

const production = {
    db: {
        name: process.env.DB_NAME, // 使用哪个数据库
        username: process.env.DB_USERNAME, // 用户名
        password: process.env.DB_PASSWORD, // 口令
        host: process.env.DB_HOSTNAME, // 主机名
        port: process.env.DB_PORT, // 端口号，MySQL默认3306
        timezone: '+08:00'
    }
}

if (process.env.NODE_ENV === 'production') {
    module.exports = {...settings, ...production}
} else if (process.env.NODE_ENV === 'test') {
    module.exports = {...settings, ...test}
} else {
    module.exports = {...settings, ...development}
}
