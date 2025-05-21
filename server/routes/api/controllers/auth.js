import express from 'express'
var router = express.Router();

router.get('/', async (req, res) => {
    if (req.session.isAuthenticated) {
        return res.json({
            isAuthenticated: true,
            user: {
                name: req.session.account.name,
                username: req.session.account.username
            }
        })
    }

    return res.json({ isAuthenticated: false })
})

export default router