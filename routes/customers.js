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


module.exports = router