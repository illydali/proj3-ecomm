'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    username: {
      type: 'string',
      length: 50,
    },
    password: {
      type: 'string',
      length: 80,
    },
    email: {
      type: 'string',
      length: 320,
    },
    role: {
      type: 'string',
      length: 30,
      notNull: true
    },
    last_login: {
      type: 'datetime'
    },
    created: {
      type: 'datetime',
      notNull: true
    },
    modified: {
      type: 'datetime'
    }
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
