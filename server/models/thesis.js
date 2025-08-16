const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thesis', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'thesis_topics',
        key: 'id'
      }
    },
    student_am: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'student',
        key: 'am'
      }
    },
    supervisor_am: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'professor',
        key: 'am'
      }
    },
    prof2_am: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'professor',
        key: 'am'
      }
    },
    prof3_am: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'professor',
        key: 'am'
      }
    },
    thesis_status: {
      type: DataTypes.ENUM('Pending','Active','Completed','Cancelled','Review'), 
      allowNull: false,
    },
    assignment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    thesis_content_file: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nemertes_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ap_from_gs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    enableGrading: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    enableAnnounce: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'thesis',
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
        name: "topic_link",
        using: "BTREE",
        fields: [
          { name: "topic_id" },
        ]
      },
      {
        name: "student_link",
        using: "BTREE",
        fields: [
          { name: "student_am" },
        ]
      },
      {
        name: "supervisor_link",
        using: "BTREE",
        fields: [
          { name: "supervisor_am" },
        ]
      },
      {
        name: "prof2_link",
        using: "BTREE",
        fields: [
          { name: "prof2_am" },
        ]
      },
      {
        name: "prof3_link",
        using: "BTREE",
        fields: [
          { name: "prof3_am" },
        ]
      },
    ]
  });
};
