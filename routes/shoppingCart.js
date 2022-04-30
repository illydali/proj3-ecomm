const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services');

router.get('/', async function(req,res){
    let cartServices = new CartServices(req.session.user.id);
    const cartItems = await cartServices.getCart();
    res.render('shoppingCart/index',{
        'cartItems': cartItems.toJSON()
    })
})

router.get('/add/:record_id', async function(req,res){
    let cartServices = new CartServices(req.session.user.id);
    await cartServices.addToCart(req.params.record_id, 1);
    req.flash('success_messages',  `Yay! Successfully added!`)
    res.redirect('/cart');
})

router.post('/updateQuantity/:record_id', async function(req,res){
    let cartServices = new CartServices(req.session.user.id);
    await cartServices.updateQuantity(req.params.record_id, req.body.newQuantity);
    req.flash('success_messages', "Quantity changed");
    res.redirect('/cart');
})

router.get('/remove/:record_id', async function(req,res){
    let cartServices = new CartServices(req.session.user.id);
    await cartServices.removeFromCart(req.params.record_id);
    req.flash('success_messages', "Removed from cart");
    res.redirect('/cart');
})

module.exports = router;
