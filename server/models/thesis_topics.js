const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thesis_topics', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    prof_am: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'professor',
        key: 'am'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    attached_discription_file: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    topic_status: {
      type: DataTypes.ENUM('assigned','temp_assigned','unassigned'),
      allowNull: false
    },
    student_am: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'student',
        key: 'am'
      }
    }
  }, {
    sequelize,
    tableName: 'thesis_topics',
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
        name: "prof_am",
        using: "BTREE",
        fields: [
          { name: "prof_am" },
        ]
      },
      {
        name: "student_am",
        using: "BTREE",
        fields: [
          { name: "student_am" },
        ]
      },
    ]
  });
};
