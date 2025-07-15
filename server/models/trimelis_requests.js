const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trimelis_requests', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    thesis_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'thesis',
        key: 'id'
      }
    },
    prof_am: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'professor',
        key: 'am'
      }
    },
    answer: {
      type: DataTypes.ENUM('pending','accepted','declined'),
      allowNull: false
    },
    invite_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    answer_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'trimelis_requests',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "thesis_id",
        using: "BTREE",
        fields: [
          { name: "thesis_id" },
        ]
      },
      {
        name: "prof_am",
        using: "BTREE",
        fields: [
          { name: "prof_am" },
        ]
      },
    ]
  });
};
