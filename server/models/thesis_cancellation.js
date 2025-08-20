const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thesis_cancellation', {
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
      },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    reason: {
      type: DataTypes.ENUM('By Professor','By Secretary'),
      allowNull: false
    },
    assembly_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    assembly_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'thesis_cancellation',
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
    ]
  });
};
