const { sequelize, Train, Booking, User } = require('../models');

module.exports = {
  bookSeat: async (req, res) => {
    const transaction = await sequelize.transaction();
    console.log("Request Body:", req.body);

    try {
      const { trainNumber, seats = 1 } = req.body;

      const train = await Train.findOne({
        where: { trainNumber },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!train) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Train not found' });
      }

      if (train.availableSeats < seats) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Not enough seats available' });
      }


      const existingBooking = await Booking.findOne({
        where: {
          userId: req.user.id,
          trainId: train.id
        },
        transaction
      });

      if (existingBooking) {
        await transaction.rollback();
        return res.status(409).json({ message: 'You have already booked this train' });
      }

      await train.decrement('availableSeats', { by: seats, transaction });

      const booking = await Booking.create({
        userId: req.user.id,
        trainId: train.id,
        seatsBooked: seats
      }, { transaction });

      await transaction.commit();
      res.status(201).json(booking);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  getBooking: async (req, res) => {
    try {
      const booking = await Booking.findByPk(req.params.id, {
        include: [Train, User],
      });
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
