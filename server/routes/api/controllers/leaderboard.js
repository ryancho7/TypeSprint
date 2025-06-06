import express from 'express'
var router = express.Router();

router.get('/', async (req, res) => {
    try {
        // exclude guest results from leaderboard
        const results = await req.models.RaceHistory.find({
            username: { $not: /^guest/i }
        }).sort({wpm: -1}).limit(10);
        res.json(results);
    } catch (error) {
        console.error('Error fetching leaderboard results:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard results' });
    }
})

export default router