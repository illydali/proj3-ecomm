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

async function getRecord(recordId) {
    const recordToUpdate = await Record.where({
        'id': recordId
    }).fetch({
        require: true,
        withRelated: ['genres']
    })
    return recordToUpdate
}

async function getAllRecords() {
    return await Record.fetchAll()
}

module.exports = {
    getAllGenres,
    getAllLabels,
    getRecord,
    getAllRecords
}