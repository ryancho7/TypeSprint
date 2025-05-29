import express from 'express'
var router = express.Router();

router.get('/getSentence', async (req, res) => {
    try {
        const [randomSentence] = await req.models.Sentence.aggregate([{ $sample: { size: 1 } }]);
        const sentenceText = randomSentence.sentence;
        res.json({sentence: sentenceText});
    } catch (error) {
        console.error('Error fetching sentence:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            sentence: "The boring default text for you to type"
        });
    }
})

export default router