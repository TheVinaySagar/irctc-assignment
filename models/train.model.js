module.exports = (sequelize, DataTypes) => {
  const Train = sequelize.define('Train', {
    trainNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    source: DataTypes.STRING,
    destination: DataTypes.STRING,
    totalSeats: DataTypes.INTEGER,
    availableSeats: DataTypes.INTEGER,
  });
  return Train;
};