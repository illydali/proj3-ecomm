const express = require("express");
const router = express.Router();
const { checkIfAuthenticated } = require('../middlewares')

// import in the all models
const {
    Record,
    Artist,
    Label,
    Genre,
    Style
} = require('../models')

// importing in the forms
const {
    createRecordForm,
    createSearchForm,
    bootstrapField,
    bootstrapFieldCol6
} = require('../forms');

// import in the dal
const dataLayer = require('../dal/records')

router.get('/', async (req, res) => {
 
    const allLabels = await dataLayer.getAllLabels()
    allLabels.unshift([0, 'All']);
    const allGenres = await dataLayer.getAllGenres()
    const allStyles = await dataLayer.getAllStyles()
    
    const searchForm = createSearchForm(allLabels, allGenres, allStyles);

    let q = Record.collection();

    searchForm.handle(req, {
        'success' : async (form) => {

            // search with casing ignored
            if (form.data.title) {
                q.where('title', 'ilike', '%' + form.data.title + '%');
            }

            if (form.data.speed) {
                q.where('speed', '=',  form.data.speed );
            }

            if (form.data.label_id && form.data.label_id != '0') {
                q.where('label_id', '=', form.data.label_id)
            }

            if (form.data.genres) {
                // joining in bookshelf:
                q.query('join', 'genres_records', 'records.id', 'record_id')
                    .where('genre_id', 'in', form.data.genres.split(','))
                // eqv:
                // SELECT * FROM posters JOIN posters_tags ON posters.id = poster_id
                // WHERE tag_id in (1,4)
            }

            let records = await q.fetch({
                withRelated: ['labels', 'genres', 'artists', 'genres.styles']
            });
            res.render('records/index', {
                'records': records.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'empty' : async (form) => {
            let records = await q.fetch({
                withRelated: ['labels' , 'genres', 'artists', 'genres.styles']
            })
            records.toJSON()
            res.render('records/index' , {
                searchForm : form.toHTML(bootstrapField),
                'records' : records.toJSON(),
                
            })
        },
        'error': async (form) => {
            let records = await q.fetch({
                withRelated: ['labels', 'genres', 'artists', 'genres.styles']
            })

            res.render('records/index', {
                searchForm: form.toHTML(bootstrapField),
                'records': records.toJSON()

            })
        },
    })
   
})

router.get('/create', checkIfAuthenticated, async (req, res) => {
    const allGenres = await dataLayer.getAllGenres()
    const allLabels = await dataLayer.getAllLabels()
    const allArtists = await dataLayer.getAllArtists()
    const createNew = createRecordForm(allGenres, allLabels, allArtists);
    res.render('records/create', {
        'form': createNew.toHTML(bootstrapFieldCol6),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', checkIfAuthenticated, async (req, res) => {
    const allGenres = dataLayer.getAllGenres()
    const allLabels = dataLayer.getAllLabels()
    const allArtists = dataLayer.getAllArtists()
    const createNew = createRecordForm(allGenres, allLabels, allArtists);
    createNew.handle(req, {
        'success': async (form) => {
            // separate out genres from the other product data
            // as not to cause an error when creating
            // the new record
            let {
                genres,
                ...recordData
            } = form.data;

            const record = new Record(recordData);

            await record.save();

            if (genres) {
                await record.genres().attach(genres.split(','))
            }
            req.flash("success_messages", `New Record ${record.get('title')} has been created`)
            res.redirect('/records');
        },
        'error': async (form) => {
            res.render('records/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// update records
router.get('/:id/update', async (req, res) => {
    const allGenres = await dataLayer.getAllGenres()
    const allLabels = await dataLayer.getAllLabels()
    const allArtists = await dataLayer.getAllArtists()
    // retrieve the record
    const record = await dataLayer.getRecord(req.params.id)
    const updateForm = createRecordForm(allGenres, allLabels, allArtists);

    // fill in the existing values
    updateForm.fields.title.value = record.get('title');
    updateForm.fields.price.value = record.get('price');
    updateForm.fields.description.value = record.get('description');
    updateForm.fields.release_date.value = record.get('release_date');
    updateForm.fields.stock.value = record.get('stock');
    updateForm.fields.record_size.value = record.get('record_size');
    updateForm.fields.speed.value = record.get('speed');
    updateForm.fields.type.value = record.get('type');

    updateForm.fields.label_id.value = record.get('label_id')
    updateForm.fields.artist_id.value = record.get('artist_id')

    // 1 - set the image url in the record form
    updateForm.fields.image_url.value = record.get('image_url');


    let selectedGenres = await record.related('genres').pluck('id');
    updateForm.fields.genres.value = selectedGenres


    res.render('records/update', {
        'form': updateForm.toHTML(bootstrapField),
        'record': record.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:id/update', async (req, res) => {
    const allGenres = dataLayer.getAllGenres()
    const allLabels = dataLayer.getAllLabels()
    const allArtists = await dataLayer.getAllArtists()
    // retrieve the record
    const record = await dataLayer.getRecord(req.params.id)

    const updateForm = createRecordForm(allGenres, allLabels, allArtists);

    updateForm.handle(req, {
        'success': async (form) => {
            let {
                genres,
                ...recordData
            } = form.data
            record.set(recordData);
            record.save();

            // update the genres 
            let genreIds = genres.split(',');
            let existingGenreIds = await record.related('genres').pluck('id');

            // remove all the genres that arent selected
            let toRemove = existingGenreIds.filter(id => genreIds.includes(id) === false)
            await record.genres().detach(toRemove);

            // add in all the genres selected in the form 
            await record.genres().attach(genreIds);

            req.flash("success_messages", `${record.get('title')} has been updated`)
            res.redirect('/records');
        },
        'error': async (form) => {
            res.render('records/update', {
                'form': form.toHTML(bootstrapField),
                'record': record.toJSON()
            })
        }
    })
})

router.get('/:id/delete', async (req, res) => {
    // fetch the record using id that we want to delete
    const record = await dataLayer.getRecord(req.params.id)

    res.render('records/delete', {
        'record': record.toJSON()
    })

});

router.post('/:id/delete', async (req, res) => {
    const record = await dataLayer.getRecord(req.params.id)

    await record.destroy();
    req.flash("success_messages", `${record.get('title')} has been deleted`)
    res.redirect('/records')

});

module.exports = router;