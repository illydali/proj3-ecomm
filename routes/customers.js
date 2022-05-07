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

    // for (let eachCustomer of customersJSON) {
    //     if (eachCustomer.user.role.includes("Deactivated")) {
    //         eachCustomer['isDeactivated'] = true;
    //     }
    //     eachCustomer['createdOnStr'] = (eachCustomer.user.created_on).toLocaleString('en-SG');
    //     eachCustomer['lastLoginOnStr'] = eachCustomer.user.last_login_on ? (eachCustomer.user.last_login_on).toLocaleString('en-SG') : null;
    // }

    // convert collection to JSON and render via hbs
    res.render('customers/index', {
        'customers': customersJSON
    })
})

module.exports = router