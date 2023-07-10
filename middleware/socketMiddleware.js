import jwt from 'jsonwebtoken'
import Player from '../models/player.js'

export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.headers.authtoken
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const player = await Player.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!player) {
            next(new Error('Please Authenticate'))
        }

        player.currentSocketId = socket.id
        await player.save()

        next()
    } catch (e) {
        console.log(e)
        next(new Error('Please Authenticate'))
    }
}