const {
    Record,
    Artist,
    Label,
    Genre,
    Style
} = require('../models')

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

async function getAllStyles() {
    const allStyles = await Style.fetchAll(
    
    ).map(style => {
        return [style.get('id'), style.get('name')]
    })
    return allStyles
}

async function getRecord(recordId) {
    const recordToUpdate = await Record.where({
        'id': recordId
    }).fetch({
        require: true,
        withRelated: ['genres', 'labels', 'artists', 'genres.styles']
    })
    return recordToUpdate
}

async function getAllRecords() {
    return await Record.fetchAll({
        require: false,
        withRelated: ['genres', 'labels', 'artists', 'genres.styles']
    })
}

async function getAllArtists() {
    const allArtists = await Artist.fetchAll().map(artist => {
        return [artist.get('id'), artist.get('name')]
    })
    return allArtists
}

module.exports = {
    getAllGenres,
    getAllLabels,
    getRecord,
    getAllRecords,
    getAllStyles,
    getAllArtists
}