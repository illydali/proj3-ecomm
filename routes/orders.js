const express = require('express');
const router = express.Router();

const {
    Order,
    User,
    OrderItem,
    Status
} = require('../models');

const { updateStatusForm, bootstrapField, bootstrapFieldCol6 } = require('../forms')

async function getAllOrders() {
    try {
        
        let orders = await Order.query('orderBy', 'id', 'DESC').fetchAll({
            require: false,
            withRelated: ['user', 'orderItems', 'orderItems.record']
        })
        return orders
    } catch (err) {
        throw (err)
    }
}

const getOrderItemsById = async (id) => {
    return await Order.where({
        'id' : id
    }).fetch({
        require: true,
        withRelated: ['user', 'orderItems', 'status']
    })
}

async function getAllOrderDetails() {
    try {
        const allDetails = await OrderItem.collection()
        .fetch({
            withRelated: ['record', 'order']
        })
        return allDetails
    } catch (err) {
        throw (err)
    }
}

router.get('/', async (req, res) => {
  
   
    let orderDetails = await getAllOrderDetails()
    let orders = await getAllOrders()
  
    res.render('orders/index', {
        'orders': orders.toJSON(),
        'orderDetails' : orderDetails.toJSON()
    })

    console.log(orders.toJSON())
    console.log(orderDetails.toJSON())
})


router.get('/:order_id/update', async (req, res) => {

    // const order = await getOrderById(req.params.order_id)
    const allStatus = await Status.fetchAll().map(status => {
        return [status.get('id'), status.get('action')]
    })
    
    const updateStatus = updateStatusForm(allStatus)

    const orderInfo = await getOrderItemsById(req.params.order_id)
    
    res.render('orders/update', {
        'form' : updateStatus.toHTML(bootstrapFieldCol6),
        // 'order' : order.toJSON(),
        'orderInfo' : orderInfo.toJSON(),
        
    })
    // console.log('----', order.toJSON())
    console.log('Orderinfo', orderInfo.toJSON())
    // console.log(allStatus.toJSON())
})


module.exports = router