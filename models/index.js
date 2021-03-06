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

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    record() {
        return this.belongsTo('Record')
    },
    user() {
        return this.belongsTo('User')
    }
})


const Order = bookshelf.model('Order', {
    tableName: 'orders',
    user() {
        return this.belongsTo('User')
    },
    orderItems() {
        return this.hasMany('OrderItem')
    },
    status() {
        return this.belongsTo('Status')
    }
})

const Status = bookshelf.model('Status', {
    tableName: 'status',
    order() {
        return this.hasMany('Order')
    }
})

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    order() {
        return this.belongsTo('Order')
    },
    record() {
        return this.belongsTo('Record')
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
})

module.exports = {
    Record,
    Artist,
    Label,
    Genre,
    Style,
    User,
    CartItem,
    Order,
    OrderItem,
    Status,
    BlacklistedToken
}