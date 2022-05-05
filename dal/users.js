const { User } = require('../models');

async function getAllUsers() {
    let users = await User.where({
        'role' : 'Customer'
    }).fetchAll({
        require: false
    })
    return users
}

module.exports = {
    getAllUsers,
}