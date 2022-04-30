const cartDataLayer = require('../dal/cart_items');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id);
    }

    async addToCart(recordId, quantity) {
        // todo: check if there is enough stock
        // todo: check if the user is eligible for discount
        // todo: for example - you can only buy one type of each category

        // todo: check if the currently logged in user
        // have already added the item to the cart
        let cartItem = await cartDataLayer.getCartItemByUserAndRecord(
            this.user_id, recordId
        )
        if (cartItem) {
           await cartDataLayer.updateCartItemQuantity(this.user_id, 
                    recordId, 
                    cartItem.get('quantity') + quantity)
        } else {
            cartItem = await cartDataLayer.createCartItem(
                this.user_id,
                recordId,
                quantity
            )
            return cartItem;
        }
       
    }

    async updateQuantity(recordId, newQuantity) {
        // todo: check if enough stock exists etc.
        await cartDataLayer.updateCartItemQuantity(this.user_id, recordId, newQuantity);
    }

    async removeFromCart(recordId) {
        await cartDataLayer.removeFromCart(this.user_id, recordId);
    }
}

module.exports = CartServices;