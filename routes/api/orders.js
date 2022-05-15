const express = require("express")
const router = express.Router()
const { Order, OrderItem } = require("../../models")


router.get("/allorders/:user_id", async (req, res) => {
    let userId = req.params.user_id
    try {
        const orders = await Order.where({
            "user_id": userId
        }).fetchAll({
            require: false,
            withRelated: ['status', 'user']
        })
        if (orders) {
            res.status(201)
            res.send(orders.toJSON())
        } else {
            res.status(501)
            res.send("No Orders")
        }
    } catch(e) {
        console.log(e)
    }  
})

router.get("/:order_id", async (req, res) => {
    let orderId = req.params.order_id
    console.log(orderId)
    let orderDetails = await OrderItem.where({
        "order_id": orderId
    }).fetchAll({
        require: false,
        withRelated: ["record", "record.labels", "record.artists", "record.genres", 'order', 'order.user', 'order.status']
    })

    // let orderInfo = await Order.where({
    //     'id' : orderId 
    // }).fetchAll({
    //     require: false,
    //     withRelated: ['status', 'user']
    // })
    console.log(orderDetails.toJSON())
    // console.log(orderInfo.toJSON())
    res.send(orderDetails)
})

module.exports = router