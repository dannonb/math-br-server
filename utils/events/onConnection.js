import { socketEvents } from '../constants.js'
import registerEvents from './registerEvents.js'

import Player from '../../models/player.js'

const { connectEvents } = socketEvents

const onConnection = async (socket) => {
    socket.on(connectEvents.registerSocketId, async (playerId) => {
        try {
            const player = await Player.findById(playerId)
            player.currentSocketId = socket.id
            await player.save()
        } catch (error) {
            console.log(error)
        }
    })
    registerEvents(socket)
}

export default onConnection;