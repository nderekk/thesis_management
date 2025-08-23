const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thesis_logs', {
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
    timedate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    prev_status: {
      type: DataTypes.ENUM('Pending','Review','Active','Completed','Cancelled'),
      allowNull: false
    },
    new_status: {
      type: DataTypes.ENUM('Pending','Review','Active','Completed','Cancelled'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'thesis_logs',
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
