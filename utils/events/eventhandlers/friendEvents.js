import {
    socketEvents,
    acknowledgementStatus
} from '../../constants.js'

import Player from '../../../models/player.js'

const { friendEvents } = socketEvents

export const sendFriendRequest = async function (sender, receiver, cb) {
    const socket = this
    const potentialFriend = await Player.findById(receiver._id)
    if (sender._id === receiver._id) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'You cannot send yourself friend requests. I am sorry, I hope things turn around for you.'
        })
    }
    if (potentialFriend.friends.includes(sender._id)) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'This player is already your friend.'
        })
    }
    if (potentialFriend.friendRequests.includes(sender._id)) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'Request has already been sent.'
        })
    }
    potentialFriend.friendRequests.push({ player: sender._id, seen: false })
    await potentialFriend.save()
    socket.to(receiver.currentSocketId).emit(friendEvents.recieveFriendRequest)
    cb({
        status: acknowledgementStatus.success,
        message: 'Request sent.'
    })
}


export const acceptFriendRequest = async function (friendRequestSender, friendRequestReceiver, cb) {
    const socket = this
    try {
        const sender = await Player.findById(friendRequestSender._id)
        const receiver = await Player.findById(friendRequestReceiver._id)

        if (!sender) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'This player no longer exists.'
            })
        }

        if (receiver.friends.includes(sender._id)) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'This player is already your friend.'
            })
        }

        const friendRequests = await receiver.friendRequests.filter(request => request.player !== friendRequestSender._id)
        receiver.friends.push(friendRequestSender._id)
        sender.friends.push(friendRequestReceiver._id)
        receiver['friendRequests'] = friendRequests
        Promise.all([
            await receiver.save(),
            await sender.save()
        ])
        const friendCurrentSocketId = sender.currentSocketId
        socket.to(friendCurrentSocketId).emit(friendEvents.friendRequestAccepted) 
        cb({
            status: acknowledgementStatus.success,
            message: `${sender.username} is now your friend.`
        })
    } catch (error) {
        console.log(error)
    }
}

export const rejectFriendRequest = async function (friendRequestSender, friendRequestReceiver, cb) {
    const socket = this
    try {
        const sender = await Player.findById(friendRequestSender._id)
        const receiver = await Player.findById(friendRequestReceiver._id)

        const friendRequests = await receiver.friendRequests.filter(request => {
            return request.player !== friendRequestSender._id
        })
        receiver['friendRequests'] = friendRequests
        await receiver.save()

        if (!sender) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'This player no longer exists.'
            })
        }

        if (receiver.friends.includes(sender._id)) {
            return cb({
                status: acknowledgementStatus.error,
                message: 'This player is already your friend.'
            })
        }
        const friendCurrentSocketId = sender.currentSocketId
        socket.to(friendCurrentSocketId).emit(friendEvents.friendRequestRejected)
        cb({
            status: acknowledgementStatus.success,
            message: `Friend request from ${sender.username} was rejected.`
        })
    } catch (error) {
        console.log(error)
    }

}