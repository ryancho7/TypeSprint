import express from 'express';
const router = express.Router();
import models from '../../../models.js';

router.get('/', async (req, res) => {
  if (req.session.isAuthenticated && req.session.account?.username) {
    try {
      const email = req.session.account.username;
      
      await models.User.findOneAndUpdate(
        { email: email },
        {
          $setOnInsert: {
            username: req.session.account.name,
            email: email
          }
        },
        { upsert: true, new: true }
      );

      return res.json({
        isAuthenticated: true,
        inGuestMode: false,
        user: {
          name: req.session.account.name,
          username: req.session.account.name
        }
      });
    } catch (error) {
      console.error('Error updating user in database:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.json({ isAuthenticated: false, inGuestMode: false });
});

export default router;