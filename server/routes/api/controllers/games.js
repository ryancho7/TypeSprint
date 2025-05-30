import express from 'express'
var router = express.Router();

router.get('/results', async (req, res) => {
    try {

    } catch (error) {
        
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