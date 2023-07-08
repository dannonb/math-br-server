import { socketEvents, playerStatus } from '../constants.js'
import registerEvents from './registerEvents.js'

import Player from '../../models/player.js'
import { rejoinPublicMatch } from '../functions/helpers.js'

const { connectEvents } = socketEvents

const onConnection = async (socket) => {
    const player = await Player.findBySocketId(socket.id)
    if (player) {
        player.status = playerStatus.IDLE
        await player.save()
    }

    // socket.on(connectEvents.rejoinGameAfterDisconnect, rejoinPublicMatch)
    
    // socket.on(connectEvents.registerSocketId, async ({ playerId }) => {
    //     try {
    //         const player = await Player.findById(playerId)
    //         player.currentSocketId = socket.id
    //         await player.save()
    //     } catch (error) {
    //         console.log(error)
    //     }
    // })
    registerEvents(socket)
}

export default onConnection;