const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart_services')

// get all items in cart
router.get('/:user_id', async (req, res) => {
    let cartServices = new CartServices(req.params.user_id)
    try {
        const cartItems = await cartServices.getCart()
        res.status(200)
        res.send(cartItems.toJSON())
    } catch (e) {
        res.status(500)
        res.send("Unable to get items.")
    }
})

// add item into cart
router.get('/:user_id/add/:record_id', async (req,res) => {
    let cartServices = new CartServices(req.params.user_id);
    try {
        await cartServices.addToCart(req.params.record_id, 1);
        res.status(200)
        res.send("Item added to shopping cart")
    } catch (e) {
        res.status(500)
        res.send("Unable to add item to shopping cart")
    }
})

// update quantity 
router.post('/:user_id/updateQuantity/:record_id', async (req,res) => {
    let cartServices = new CartServices(req.params.user_id);
    try {
        await cartServices.updateQuantity(req.params.record_id, req.body.newQuantity);
        res.status(200)
        res.send("Quantity of cart item updated")
    } catch (e) {
        res.status(500)
        res.send("Unable to update cart item quantity")
    }
})

// remove from cart
router.get('/:user_id/remove/:record_id', async (req,res) => {
    let cartServices = new CartServices(req.params.user_id);
    try {
        await cartServices.removeFromCart(req.params.record_id);
        res.status(200)
        res.send("Cart item removed")
    } catch (e) {
        res.status(500)
        res.send("Unable to remove cart item")
    }
})

module.exports = router; 