import express from 'express'
var router = express.Router();

import textRouter from './controllers/text.js'
import gamesRouter from './controllers/games.js'
import authRouter from './controllers/auth.js'
import leaderboardRouter from './controllers/leaderboard.js'
import { getFriends, getAllUsers, inviteFriend } from './controllers/users.js'

router.get('/users/friends', getFriends);
router.get('/users/all', getAllUsers);
router.post('/users/invite/:targetId', inviteFriend);

router.use('/text', textRouter);
router.use('/lobbies', lobbiessRouter);
router.use('/games', gamesRouter);
router.use('/auth', authRouter);
router.use('/leaderboard', leaderboardRouter);

export default router