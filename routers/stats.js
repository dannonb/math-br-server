import express from 'express';
import Stats from '../models/stats.js'
import auth from '../middleware/auth.js'

const router = new express.Router()

router.get('/profile/stats', auth,  async (req, res) => {
    const player = req.user
    try {
        const stats = Stats.findOne({ player: player._id })
        
    } catch (err) {
        
    }
})

export default router