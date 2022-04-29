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
    bootstrapField
} = require('../forms');

async function getAllGenres() {
    const allGenres = await Genre.fetchAll().map(genre => {
        return [genre.get('id'), genre.get('name')]
    })
    return allGenres;
}

async function getAllLabels() {
    const allLabels = await Label.fetchAll().map(label => {
        return [label.get('id'), label.get('name')]
    })
    return allLabels
}

async function getRecord(recordId) {
    const recordToUpdate = await Record.where({
        'id': recordId
    }).fetch({
        require: true,
        withRelated: ['genres']
    })
    return recordToUpdate
}

router.get('/', async (req, res) => {
    // #2 - fetch all the products (ie, SELECT * from products)
    // let records = await Record.collection().fetch({
    //     withRelated: ['labels', 'genres']
    // });
    // res.render('records/index', {
    //     'records': records.toJSON() // #3 - convert collection to JSON
    // })

    const allLabels = await getAllLabels()
    allLabels.unshift([0, 'All']);
    const allGenres = await getAllGenres()
    const searchForm = createSearchForm(allLabels, allGenres);

    let q = Record.collection();

    searchForm.handle(req, {
        'success' : async (form) => {
            if (form.data.title) {
                q.where('title', 'like', '%' + form.data.title + '%');
            }

            // if (form.data.min_price) {
            //     q.where('price', '>=', form.data.min_price);
            // }

            // if (form.data.max_price) {
            //     q.where('price', '<=', form.data.max_price);
            // }

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
                withRelated: ['labels', 'genres']
            });
            res.render('records/index', {
                'records': records.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'empty' : async (form) => {
            let records = await q.fetch({
                withRelated: ['labels' , 'genres']
            })

            res.render('records/index' , {
                searchForm : form.toHTML(bootstrapField),
                'records' : records.toJSON()
            })
        },
        'error': async (form) => {
            let records = await q.fetch({
                withRelated: ['labels', 'genres']
            })

            res.render('posters/index', {
                searchForm: form.toHTML(bootstrapField),
                'records': records.toJSON()

            })
        },
    })
   
})

router.get('/create', checkIfAuthenticated, async (req, res) => {
    const allGenres = await getAllGenres()
    const allLabels = await getAllLabels()
    const createNew = createRecordForm(allGenres, allLabels);
    res.render('records/create', {
        'form': createNew.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', checkIfAuthenticated, async (req, res) => {
    const allGenres = getAllGenres()
    const allLabels = getAllLabels()
    const createNew = createRecordForm(allGenres, allLabels);
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
            // record.set('title', form.data.title);
            // record.set('price', form.data.price);
            // record.set('description', form.data.description);
            // record.set('release_date', form.data.release_date);
            // record.set('stock', form.data.stock)
            // record.set('record_size', form.data.record_size);
            // record.set('speed', form.data.speed);
            // record.set('type', form.data.type);
            // record.set('label_id', form.data.label_id)

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
    const allGenres = await getAllGenres()
    const allLabels = await getAllLabels()
    // retrieve the record
    const record = await getRecord(req.params.id)

    const updateForm = createRecordForm(allGenres, allLabels);

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
    const allGenres = getAllGenres()
    const allLabels = getAllLabels()
    // retrieve the record
    const record = await getRecord(req.params.id)

    const updateForm = createRecordForm(allGenres, allLabels);

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
    const record = await getRecord(req.params.id)

    res.render('records/delete', {
        'record': record.toJSON()
    })

});

router.post('/:id/delete', async (req, res) => {
    const record = await getRecord(req.params.id)

    await record.destroy();
    req.flash("success_messages", `${record.get('title')} has been deleted`)
    res.redirect('/records')

});

module.exports = router;