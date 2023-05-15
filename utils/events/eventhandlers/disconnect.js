import Player from "../../../models/player.js"
import { playerStatus } from "../../constants.js"
import { handleStatusChange } from "./statusChange.js"
import { removeDisconnectedPlayerFromQueue } from "../../matchmaking.js"

export const handleDisconnect = async function () {
    const socket = this
    const player = await Player.findBySocketId(socket.id)

    if (!player) return;

    if (player.status === playerStatus.MATCHMAKING) {
        removeDisconnectedPlayerFromQueue(player.currentQueueId, player._id)
    }

    player.status = playerStatus.OFFLINE
    player.currentQueueId = ''
    player.currentSocketId = ''
    await player.save()
    handleStatusChange(player, socket)
}

export const handleDisconnecting = async function (socket) {
    // checks to see if player is in queue and if so removes them from the queue
    // checks to see if player is in game and if so 
        // if custom game, notifies players that the player has left
    // then removes player from all games    
}