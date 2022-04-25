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
  return db.createTable('styles_genres', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    style_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'styles_genres_style_fk',
        table: 'styles',
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
        name: 'styles_genres_genre_fk',
        table: 'genres',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
