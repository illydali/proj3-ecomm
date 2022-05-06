const express = require('express');
const router = express.Router();

const { Customer } = require('../models');

async function getCustomerByUserId(userId) {
    let customer = await Customer.where({
        user_id: userId
    }).fetch({
        require: false,
        withRelated: ['user']
    })
    return customer
} 

router.get('/', async (req, res) => {
    // fetch all the customers
    let customers = await Customer.collection()
    .fetch({
        require: false,
        withRelated: [ 'user']
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