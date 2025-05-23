const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Train, Booking } = require('../models');



module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, ...otherFields } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        password: hashedPassword,
        ...otherFields,
      });

      const { password: _, ...userWithoutPassword } = user.toJSON();

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};