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
  const promises = []

  promises.push(
    db.addColumn('users', 'first_name', {
      type: 'string',
      length: 50
    }),
    db.addColumn('users', 'last_name', {
      type: 'string',
      length: 50
    }),
    db.addColumn('users', 'address', {
      type: 'string',
      length: 100
    }),
    db.addColumn('users', 'contact', {
      type: 'int',
      unsigned: true
    }),
    db.addColumn('users', 'birth_date', {
      type: 'date',
    })
  )

  return Promise.all(promises);
  
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};