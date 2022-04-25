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
  return db.createTable('records_genres', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    record_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'records_genres_record_fk',
        table: 'records',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    genre_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'records_genres_genre_fk',
        table: 'genres',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable('records_genres');
};

exports._meta = {
  "version": 1
};