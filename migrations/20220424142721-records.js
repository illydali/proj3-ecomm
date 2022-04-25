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
  return db.createTable('records', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: 'string',
      length: 1000,
      notNull: false
    },
    price: {
      type: 'int',
      unsigned: true,
      notNull: false
    },
    description: {
      type: 'text'
    },
    release_date: {
      type: 'date'
    },
    stock: {
      type: 'int',
      unsigned: true
    },
    record_size: {
      type: 'smallint',
      unsigned: true
    },
    speed: {
      type: 'smallint',
      unsigned: true
    },
    type: {
      type: 'string',
      length: 100
    },
    main_image: {
      type: 'string',
      length: 200
    }
  })
};

exports.down = function (db) {
  return db.dropTable('records');
};

exports._meta = {
  "version": 1
};