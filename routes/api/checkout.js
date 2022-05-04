const express = require("express")
const router = express.Router();

const {
    CartItem,
    User
} = require('../../models');

const CartServices = require('../../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


// /api/checkout?user_id=1
router.get('/', async (req, res) => {
    const cart = new CartServices(req.query.user_id);

    // get all the items from the cart
    let items = await cart.getCart();

    // let user = await User.where({
    //     'id': req.params.user_id
    // }).fetch({
    //     require: true
    // })

    // step 1 - create line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            'name': item.related('record').get('title'),
            'amount': item.related('record').get('price'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }
        if (item.related('record').get('image_url')) {
            lineItem['images'] = [item.related('record').get('image_url')]
        }
        lineItems.push(lineItem);
        // save the quantity data along with the record id
        meta.push({
            'record_id': item.get('record_id'),
            'quantity': item.get('quantity'),
            // 'user_id': user.get('id')
        })
    }

    // step 2 - create stripe payment && stringify for metadata use later 
    let metaData = JSON.stringify(meta);
    const payment = {
        // client_reference_id: user.id,
        // customer_email: user.get('email'),
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_CANCELLED_URL,
        metadata: {
            'orders': metaData
        }
    }
    // step 3: register the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    // console.log(payment)

    // res.status(200).send({
    //     'sessionId': stripeSession.id, // 4. Get the ID of the session
    //     'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    // })

    res.render('checkout/checkout', {
        'sessionId': stripeSession.id, // 4. Get the ID of the session
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success', function (req, res) {
    res.send('Successful')
})

router.get('/cancelled', function (req, res) {
    res.send('ERROR: GO AND REDO!')
})

// router.post('/process_payment', express.raw({
//     'type':'application/json'
// }), function(req,res){
//     let payload = req.body;
//     // console.log(payload)
    
//     let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
//     // console.log(endpointSecret)
    
//     let sigHeader = req.headers['stripe-signature'];
//     console.log(sigHeader)
    
//     let event;
//     try {
//         event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
//     } catch(e) {
//         res.send({
//             "error": e.message
//         })
//         console.log(e.message)
//     }
//     console.log(event)
//     if (event.type === 'checkout.session.completed') {
//         let stripeSession = event.data.object;
//         console.log(stripeSession)
//     }
//     res.send({
//         'recieved': true
//     })
// })
// this is the webhook route
// stripe will send a POST request to this route when a
// payment is completed
router.post('/process_payment', express.raw({
    'type': 'application/json'
}), async function (req, res) {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;

    // REMEMBER TO CHANGE GITPOD URL TO PUBLIC!!!!!!!!! 

    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    } catch (e) {
        res.send({
            "error": e.message
        })
        console.log(e.message)
    }

    console.log(event)
    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;
        console.log(stripeSession);
        console.log(event.data.object)
        console.log(stripeSession.metadata);
    }
    res.send({
        'received': true
    })
})

module.exports = router