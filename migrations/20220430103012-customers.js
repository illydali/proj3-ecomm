'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('customers', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    first_name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    last_name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    address: {
      type: 'string',
      length: 100
    },
    contact: {
      type: 'int',
      unsigned: true,
    },
    birth_date: {
      type: 'date'
    }
  })
};

exports.down = function (db) {
  return db.dropTable('customers');
};

exports._meta = {
  "version": 1
};