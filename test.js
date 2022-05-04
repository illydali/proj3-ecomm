this is the webhook route
stripe will send a POST request to this route when a
payment is completed
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