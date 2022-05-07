const express = require('express');
const router = express.Router();

const {
    Order,
    User,
} = require('../models');

async function getAllOrders() {
    try {
        

        let orders = await Order.collection()
        .fetch({
            withRelated: ['user']
        })
        return orders
    } catch (err) {
        throw (err)
    }
}

router.get('/', async (req, res) => {
    let orders = await getAllOrders()

    res.render('orders/index', {
        'orders': orders.toJSON()
    })
})

module.exports = router