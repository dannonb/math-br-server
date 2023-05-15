import jwt from 'jsonwebtoken'
import Player from '../models/player.js'

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const player = await Player.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!player) {
            throw new Error()
        }

        req.token = token
        req.player = player
        next()

    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate' })
    }
}

export default auth