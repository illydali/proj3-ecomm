const express = require('express');
const router = express.Router();

const {
    Record
} = require('../../models')

const {
    getAllRecords,
    getAllLabels,
    getAllGenres
} = require('../../dal/records');

router.get('/', async (req, res) => {
    res.json(await getAllRecords());
})

router.get('/labels', async (req,res) => {
    res.json(await getAllLabels());
})

router.get('/genres', async(req,res) => {
    res.json(await getAllGenres())
})

router.post('/filters', async (req, res) => {
    let q = Record.collection();

    // search by record title
    if (req.body.title) {
        q.where('title', 'ilike', '%' + req.body.title + '%');
    }
    let label_id = parseInt(req.body.label_id)
    if (label_id) {
        q.where('label_id', "=", label_id)
    }
    
    if (req.body.genres) {
        q.query ('join', 'genres_records', 'records.id', 'record_id')
            .where('genre_id', 'in', req.body.genres.split(','))
    }

    let records = await q.fetch({
        withRelated: ['labels', 'genres', 'artists', 'genres.styles']
    })
    res.send(records)
})

module.exports = router;