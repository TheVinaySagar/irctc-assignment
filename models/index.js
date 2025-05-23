const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.User = require('./user.model')(sequelize, Sequelize.DataTypes);
db.Train = require('./train.model')(sequelize, Sequelize.DataTypes);
db.Booking = require('./booking.model')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
