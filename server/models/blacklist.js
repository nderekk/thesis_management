// models/blacklist.js
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('blacklist', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(512), // Adjust size if needed
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'blacklist',
    timestamps: false, // This enables `createdAt` and `updatedAt`
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }]
      },
      {
        name: 'token_idx',
        using: 'BTREE',
        fields: [{ name: 'token' }]
      }
    ]
  });
};
