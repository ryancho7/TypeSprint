import express from 'express'
var router = express.Router();

router.get('/results', async (req, res) => {
    try {
        const username = req.query.username;
        const results = await req.models.RaceHistory.find({username: username}).sort({date: -1});
        res.json(results);
    } catch (error) {
        console.error('Error fetching race results:', error);
        res.status(500).json({ error: 'Failed to fetch race results' });
    }
})

router.post('/results', async (req, res) => {
    try {
        const newResult = new req.models.RaceHistory({
            username: req.body.username,
            wpm: req.body.wpm,
            finishingPosition: req.body.finishingPosition,
            date: new Date(),
        });
        await newResult.save();
        res.status(201).json({ 
            message: "Race result saved successfully",
            id: newResult._id 
        });
    } catch (error) {
        console.error('Error saving race result:', error);
        res.status(500).json({ error: 'Failed to save race result' });
    }
})

export default router