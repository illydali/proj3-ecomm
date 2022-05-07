const orderDAL = require("../dal/orders")

class OrdersServices {
    constructor(user_id){
        this.user_id = user_id
    }

    async getAll() {
        return await orderDAL.getAllOrders()
    }

}

module.exports = OrdersServices