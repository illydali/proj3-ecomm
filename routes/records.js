const express = require("express");
const router = express.Router();

// #1 import in the Product model
const { Record } = require('../models')

router.get('/', async (req,res)=>{
    // #2 - fetch all the products (ie, SELECT * from products)
    let records = await Record.collection().fetch();
    res.render('records/index', {
        'recors': records.toJSON() // #3 - convert collection to JSON
    })
})


module.exports = router;