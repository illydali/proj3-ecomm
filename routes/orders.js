const express = require('express');
const router = express.Router();

const {
    Order,
    User,
    OrderItem,
    Status
} = require('../models');

const {
    checkIfAuthenticated
} = require('../middlewares')

const {
    updateStatusForm,
    createOrderSearchForm,
    bootstrapField,
    bootstrapFieldCol6
} = require('../forms')

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
        'id': id
    }).fetch({
        require: true,
        withRelated: ['user', 'orderItems', 'status']
    })
    return orderItem
}

const getAllOrderDetails = async () => {
    const allOrders = await OrderItem.collection()
        .fetch({
            require: true,
            withRelated: ['record', 'order']
        })
    return allOrders
}

const getAllOrderDetailsByOrderId = async (id) => {
    try {
        const allDetails = await OrderItem.where({
                'order_id': id
            })
            .fetchAll({
                withRelated: ['record', 'order', ]
            })
        return allDetails
    } catch (err) {
        throw (err)
    }
}

const getAllStatus = async () => {
    const allStatus = await Status.fetchAll({}).map(status => {
        return [status.get('id'), status.get('action')]
    })
    return allStatus
}

router.get('/', async (req, res) => {


    // const orderDetails = await getAllOrderDetails()
    // const orders = await getAllOrders()

    // res.render('orders/index', {
    //     'orders': orders.toJSON(),
    //     'orderDetails' : orderDetails.toJSON()
    // })

    const allStatus = await getAllStatus()
    allStatus.unshift([0, "-"])
    const orderSearchForm = createOrderSearchForm(allStatus)

    let q = Order.collection();

    orderSearchForm.handle(req, {
        "empty": async (form) => {
            // Get all orders

            const allOrders = await getAllOrders()
            const orderDetails = await getAllOrderDetails()

            let allOrdersJSON = allOrders.toJSON()
            let orderDetailsJSON = orderDetails.toJSON()


            let reversedAllOrders = [...allOrdersJSON].reverse()
            let reversedOrderDetails = [...orderDetailsJSON].reverse()
            res.render("orders/index", {
                "orders": reversedAllOrders,
                'orderDetails': reversedOrderDetails,
                "orderSearchForm": form.toHTML(bootstrapField)
            })
        },
        "error": async (form) => {
            // Get all orders

            const allOrders = await getAllOrders()
            const orderDetails = await getAllOrderDetails()

            let allOrdersJSON = allOrders.toJSON()
            let orderDetailsJSON = orderDetails.toJSON()


            let reversedAllOrders = [...allOrdersJSON].reverse()
            let reversedOrderDetails = [...orderDetailsJSON].reverse()
            res.render("orders/index", {
                "orders": reversedAllOrders,
                'orderDetails': reversedOrderDetails,
                "orderSearchForm": form.toHTML(bootstrapField)
            })
        },
        "success": async (form) => {
            if (form.data.status_id !== "0") {
                q = q.where("status_id", "=", form.data.status_id)
            }

            if (form.data.order_id) {
                q = q.where("id", "=", form.data.order_id)
            }

            if (form.data.user_id) {
                q = q.where("user_id", "=", form.data.user_id)
            }

            if (form.data.min_total) {
                q.where('payment_total', '>=', form.data.min_total);
            }

            if (form.data.max_total) {
                q.where('payment_total', '<=', form.data.max_total);
            }

            let orders = await q.fetch({
                withRelated: ['status', 'orderItems', 'user']
            })
            let ordersJSON = orders.toJSON()

            const orderDetails = await getAllOrderDetails()
            let orderDetailsJSON = orderDetails.toJSON()

            let reverseOrder = [...ordersJSON].reverse()
            let reversedOrderDetails = [...orderDetailsJSON].reverse()
            res.render("orders/index", {
                "orders": reverseOrder,
                'orderDetails': reversedOrderDetails,
                "orderSearchForm": form.toHTML(bootstrapField)
            })
        }
    })
})


router.get('/:order_id/update', async (req, res) => {

    // const order = await getOrderById(req.params.order_id)
    const allStatus = await Status.fetchAll().map(status => {
        return [status.get('id'), status.get('action')]
    })

    const updateStatus = updateStatusForm(allStatus)

    const orderInfo = await getOrderItemsById(req.params.order_id)
    const orderDetails = await getAllOrderDetailsByOrderId(req.params.order_id)
    res.render('orders/update', {
        'form': updateStatus.toHTML(bootstrapFieldCol6),
        'orderInfo': orderInfo.toJSON(),
        'orderDetails': orderDetails.toJSON()

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

            await orderInfo.save();

            req.flash('success_messages', 'Order status has been updated.')
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