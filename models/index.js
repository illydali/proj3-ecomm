const bookshelf = require('../bookshelf')

const Record = bookshelf.model('Record', {
    tableName: 'records',
    artists() {
        return this.belongsTo('Artist')
    },
    labels() { 
        return this.belongsTo('Label')
    },
    genres() {
        return this.belongsToMany('Genre')
    }
});

const Artist = bookshelf.model('Artist', {
    tableName: 'artists',
    records() {
        return this.hasMany('Record')
    }
})

const Label = bookshelf.model('Label', {
    tableName: 'labels',
    labels() {
        return this.hasMany('Record')
    }
})

const Genre = bookshelf.model('Genre', {
    tableName: 'genres',
    records() {
        return this.belongsToMany('Record')
    },
    styles() {
        return this.belongsToMany('Style')
    }
})

const Style = bookshelf.model('Style', {
    tableName: 'styles',
    genres() {
        return this.belongsToMany('Genre')
    }
})

const User = bookshelf.model('User', {
    tableName: 'users'
})

const Customer = bookshelf.model('Customer', {
    tableName: 'customers',
    user() {
        return this.belongsTo('User');
    }
})

module.exports = { Record, Artist, Label, Genre, Style, User, Customer }