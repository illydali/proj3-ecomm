const express = require('express');
const router = express.Router();

const {
    Order,
    User,
    OrderItem,
    Status
} = require('../models');

const { checkIfAuthenticated } = require('../middlewares')

const { updateStatusForm, bootstrapField, bootstrapFieldCol6 } = require('../forms')

async function getAllOrders() {
    try {
        
        const orders = await Order.query('orderBy', 'id', 'DESC').fetchAll({
            require: false,
            withRelated: ['user', 'orderItems', 'orderItems.record', 'status']
        })
        return orders
    } catch (err) {
        throw (err)
    }
}

const getOrderItemsById = async (id) => {
    const orderItem = await Order.where({
        'id' : id
    }).fetch({
        require: true,
        withRelated: ['user', 'orderItems', 'status']
    })
    return orderItem
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
  
   
    const orderDetails = await getAllOrderDetails()
    const orders = await getAllOrders()
  
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
    const orderDetails = await getAllOrderDetails()
    res.render('orders/update', {
        'form' : updateStatus.toHTML(bootstrapFieldCol6),
        'orderInfo' : orderInfo.toJSON(),
        'orderDetails' : orderDetails.toJSON()
        
    })
    console.log('Orderinfo', orderInfo.toJSON())
    console.log(orderDetails.toJSON())
})

router.post('/:order_id/update', checkIfAuthenticated, async (req, res) => {
    const orderInfo = await getOrderItemsById(req.params.order_id)
    const allStatus = await Status.fetchAll().map(status => {
        return [status.get('id'), status.get('action')]
    })
    const updateStatus = updateStatusForm(allStatus)
    updateStatus.handle(req, {
        'success': async (form) => {
            // Update status
            orderInfo.set(form.data)
            // // If status is delivered, add date now to completion date. 
            // if (order.get('status_id') == '4') {
            //     order.set('date_of_completion', new Date())
            // } else {
            //     // Safeguard if changed from 4 to other num
            //     order.set('date_of_completion', null)
            // }
            await orderInfo.save();

            req.flash('success_messages', 'Order has been updated.')
            res.redirect('/orders')
        },
        'error': async (form) => {
            res.render('orders/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router