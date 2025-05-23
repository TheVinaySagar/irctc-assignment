require('dotenv').config();
const express = require('express');
const db = require('./models');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trains', require('./routes/train.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));

const initializeServer = async () => {
  try {
    await db.sequelize.sync({ alter: true });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

initializeServer();
