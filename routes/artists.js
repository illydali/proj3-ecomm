const express = require("express");
const router = express.Router();

const { Artist } = require('../models')

const { createArtistForm, bootstrapField } = require('../forms');

const { checkIfAuthenticated } = require('../middlewares');

async function getArtist(artistId) {
    const artistToUpdate = await Artist.where({
        'id' : artistId
    }).fetch({
        require: true,
    })
    return artistToUpdate
}

// async function getAllArtists() {
//     const allArtists = await (await Artist.fetchAll()).map(artist => {
//         return [artist.get('id'), artist.get('name')]
//     })
//     return allArtists
// }

router.get('/', async (req,res) => {
    let artists = await Artist.collection().fetch()

    res.render('artists/index', {
        'artists' : artists.toJSON()
    })
})

router.get('/create', checkIfAuthenticated, async (req,res) => {
    const createNew = await createArtistForm();
    res.render('artists/create', {
        'form': createNew.toHTML(bootstrapField)
    })
})

router.post('/create', checkIfAuthenticated, async(req,res) => {
    const createNew = await createArtistForm();
    createNew.handle(req, {
        'success' : async (form) => {
            const artist = new Artist (form.data)

            await artist.save()
            res.redirect('/artists');
        },
        'error' : async (form) => {
            res.render('artists/create', {
                'form' : form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:id/update', async (req,res) => {
    const artist = await getArtist(req.params.id)
    const updateForm = createArtistForm()

    updateForm.fields.name.value = artist.get('name'),
    updateForm.fields.about.value = artist.get('about')

    res.render('artists/update', {
        'form' : updateForm.toHTML(bootstrapField),
        'artist': artist.toJSON()
    })
})

router.post('/:id/update', async (req,res) => {
    const artist = await getArtist(req.params.id)
    const updateForm = createArtistForm()
    updateForm.handle(req, {
        'success' : async (form) => {
            artist.set(form.data)
            artist.save();

            res.redirect('/artists')
        },
        'error' : async(form) => {
            res.render('artists/update', {
                'form' : form.toHTML(bootstrapField),
                'artist': artist.toJSON()
            })
        }
    })
})

router.get('/:id/delete', async (req, res) => {
    const artist = await getArtist(req.params.id)

    res.render('artists/delete', {
        'artist': artist.toJSON()
    })

});

router.post('/:id/delete', async (req, res) => {
    const artist = await getArtist(req.params.id)

    await artist.destroy();
    res.redirect('/artists')

});

module.exports = router;