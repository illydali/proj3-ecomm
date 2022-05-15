const express = require('express');
const router = express.Router();

const { getAllRecords, getRecord } = require('../../dal/records');

router.get('/', async (req, res) => {
    res.json(await getAllRecords());
})
    

module.exports = router;