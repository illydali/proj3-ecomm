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
  return db.createTable('labels', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'string', 
      length: 1000,
      notNull: false
    },
    country: {
      type: 'string',
      length: 200
    },
    info: {
      type: 'text',
    },
    image_url: {
      type: 'string',
      length: 500
    }
  });
};

exports.down = function(db) {
  return db.dropTable('labels');
};

exports._meta = {
  "version": 1
};
