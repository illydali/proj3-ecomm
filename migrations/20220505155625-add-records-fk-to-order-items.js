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
  return db.addColumn('order_items', 'record_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'order_items_record_fk',
      table: 'records',
      mapping: 'id',
      rules: {
        onDelete: 'cascade',
        onUpdate: 'restrict'
      }
    }
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
