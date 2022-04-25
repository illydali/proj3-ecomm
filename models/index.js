const bookshelf = require('../bookshelf')

const Record = bookshelf.model('Record', {
    tableName: 'records',
    artist() {
        return this.belongsTo('Artist')
    }
});

const Artist = bookshelf.model('Artist', {
    tableName: 'artists',
    records() {
        return this.hasMany('Record')
    }
})
module.exports = { Record, Artist }