const Sequelize = require('sequelize');
const db = require('../utils/db')

module.exports = db.defineModel('pet', {
    name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '姓名',
    },
    gender: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: '性别',
    },
    birth: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: '生日',
    }
}, {
    indexes: [
        {
            name: 'name_index',
            fields: ['name'],
            // unique: true
        }
    ],
    comment: 'pet'
})

