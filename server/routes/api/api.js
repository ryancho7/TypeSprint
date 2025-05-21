import express from 'express'
var router = express.Router();

import usersRouter from './controllers/users.js'
import textRouter from './controllers/text.js'
import statsRouter from './controllers/stats.js'
import lobbiessRouter from './controllers/lobbies.js'
import gamesRouter from './controllers/games.js'
import authRouter from './controllers/auth.js'
import leaderboardRouter from './controllers/leaderboard.js'

router.use('/users', usersRouter);
router.use('/text', textRouter);
router.use('/stats', statsRouter);
router.use('/lobbies', lobbiessRouter);
router.use('/games', gamesRouter);
router.use('/auth', authRouter);
router.use('/leaderboard', leaderboardRouter);

export default router