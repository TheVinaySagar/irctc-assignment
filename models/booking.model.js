module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    seatsBooked: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    trainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trains',
        key: 'id'
      }
    }
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Booking.belongsTo(models.Train, {
      foreignKey: 'trainId',
      onDelete: 'CASCADE'
    });
  };

  return Booking;
};
