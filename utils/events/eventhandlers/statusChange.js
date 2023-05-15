import Player from "../../../models/player.js";
import { playerStatus, socketEvents } from "../../constants.js";

const { statusEvents } = socketEvents

export const handleStatusChange = async (player, socket) => {
    for (let friendId in player.friends) {
        const friend = await Player.find({ _id: player.friends[friendId] })
        if (!friend || !friend.currentSocketId) return;

        if (friend.status != playerStatus.OFFLINE) {
            socket.to(friend.currentSocketId).emit(statusEvents.updateStatus, {friend: player.username, status: player.status})
        }
    }
}