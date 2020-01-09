const Sequelize = require('sequelize');
const uuid = require('node-uuid');
const settings = require('../settings');

function generateId() {
    return uuid.v4()
}

const sequelize = new Sequelize(settings.db.name, settings.db.username, settings.db.password, {
    host: settings.db.host,
    dialect: settings.db.dialect,
    timezone: settings.db.timezone,
    define: {
        underscored: true,   // 字段以下划线（_）来分割（默认是驼峰命名风格）
        freezeTableName: true,  // 自定义表名
        timestamps: false   // 是否需要增加createdAt、updatedAt、deletedAt字段
    },
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

function defineModel(name, attributes, options) {
    const _attributes = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        create_time : {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
            comment: '创建时间'
        },
        update_time: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
            comment: '修改时间'
        },
        delete_flag: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            comment: '删除标志'
        },
        version: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: '版本'
        }
    }

    const _options = {
        tableName: name,
        hooks: {
            beforeUpdate: function (instance) {    // beforeUpdate钩子里面更新update_time和version; beforeValidate钩子里面判断是否是初次创建
                instance.update_time = Date.now();
                instance.version++;
            }
        }
    };

    return sequelize.define(name, {..._attributes, ...attributes}, {..._options, ...options});
}


module.exports = {
    defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({force: false});
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
}
