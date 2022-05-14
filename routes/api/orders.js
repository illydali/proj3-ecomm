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
        withRelated: ["record", "record.labels", "record.artists", "record.genres", 'order']
    })

    console.log(orderDetails.toJSON())
    res.send(orderDetails)

})

// router.get("/:order_id", async (req, res) => {
//     let orderId = req.params.order_id
//     let orders = await Order.where({
//         "id": orderId
//     }).fetch({
//         require: false,
//         withRelated: ["status"]
//     })
//     if (orders) {
//         res.send(orders)
//     } else {
//         res.send("No Orders")
//     }
// })

module.exports = router