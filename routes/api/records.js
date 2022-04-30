const express = require('express');
const router = express.Router();

const { getAllRecords, getRecord } = require('../../dal/records');

router.get('/', async(req, res)=> {
    res.json(await getAllRecords());
})

router.get('/:record_id', async(req, res) => {
    let recordId = req.params.record_id;
    try {
        let record = await getRecord(recordId)
        if (record) {
            res.status(200);
            res.send(record);
        } else {
            res.status(404);
            res.send("Record Not Found");
        }
        
    } catch (err) {
        res.status(500);
        res.send("Sorry, there is an internal server error");
        console.log(err);
    }
})

module.exports = router;