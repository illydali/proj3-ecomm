const bookshelf = require('../bookshelf')

const Record = bookshelf.model('Record', {
    tableName: 'records'
});

module.exports = { Record }