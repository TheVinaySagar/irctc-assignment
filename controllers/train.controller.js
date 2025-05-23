const { Train } = require('../models');
const { Sequelize } = require('sequelize');
module.exports = {
  createTrain: async (req, res) => {
    try {
      const train = await Train.create(req.body);
      res.status(201).json(train);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAvailability: async (req, res) => {
    try {
      const trains = await Train.findAll({
        where: {
          source: req.query.source,
          destination: req.query.destination,
          availableSeats: { [Sequelize.Op.gt]: 0 },
        },
      });
      res.json(trains);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};