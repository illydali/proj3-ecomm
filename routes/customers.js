const express = require('express');
const router = express.Router();

const { User } = require('../models');

async function getUserById(userId) {
    let customer = await User.where({
        user_id: userId,
        role: 'Customer'
    }).fetch({
        require: false,
    })
    return customer
} 

router.get('/', async (req, res) => {
    // fetch all the customers
    let customers = await User.where({
        role: 'Customer'
    })
    .fetchAll({
        require: false,
    });

    let customersJSON = customers.toJSON();

    res.render('customers/index', {
        'customers': customersJSON
    })
})

module.exports = router