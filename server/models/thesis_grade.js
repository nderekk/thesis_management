const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thesis_grade', {
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
    final_grade: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
     prof1am: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'professor',
        key: 'am'
      },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    prof1_grade1: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof1_grade2: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof1_grade3: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof1_grade4: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof2am: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'professor',
        key: 'am'
      },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    prof2_grade1: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof2_grade2: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof2_grade3: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof2_grade4: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof3am: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'professor',
        key: 'am'
      },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    prof3_grade1: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof3_grade2: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof3_grade3: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    },
    prof3_grade4: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'thesis_grade',
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
