const {
    CartItem
} = require('../models')

const getCart = async (userId) => {
    return await CartItem.collection()
        .where({
            'user_id': userId
        }).fetch({
            require: false,
            withRelated: ['record']
        })
}

/* check whether the user has added an item to the cart */
const getCartItemByUserAndRecord = async (userId, recordId) => {
    return await CartItem.where({
        'user_id': userId,
        'record_id': recordId
    }).fetch({
        require: false
    });
}

async function createCartItem(userId, recordId, quantity) {
    // an instance of a model represents one row in the table
    // so to create a new row, simply create a new instance
    // of the model
    let cartItem = new CartItem({
        'user_id': userId,
        'record_id': recordId,
        'quantity': quantity
    });

    await cartItem.save(); // save the new row to the database
    return cartItem;
}

async function updateCartItemQuantity(userId, recordId, quantity) {
    let cartItem = await getCartItemByUserAndRecord(userId, recordId);
    cartItem.set('quantity', quantity);
    await cartItem.save();
    return cartItem;
}

async function removeFromCart(userId, recordId) {
    let cartItem = await getCartItemByUserAndRecord(userId, recordId);
    await cartItem.destroy();
}

module.exports = {
    getCart,
    getCartItemByUserAndRecord,
    createCartItem,
    updateCartItemQuantity,
    removeFromCart
}