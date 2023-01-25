import {
    socketEvents,
    acknowledgementStatus
} from '../../constants.js'

import Player from '../../../models/player.js'

const { friendEvents } = socketEvents

export const sendFriendRequest = async function ({ senderId, receiverId }, cb) {
    const socket = this
    const sender = await Player.findById(senderId)
    const potentialFriend = await Player.findById(receiverId)
    if (!potentialFriend) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'Friend does not exist.'
        })
    }
    if (senderId === receiverId) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'You cannot send yourself friend requests. I am sorry, I hope things turn around for you.'
        })
    }
    if (potentialFriend.friends.includes(senderId)) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'This player is already your friend.'
        })
    }
    if (potentialFriend
        .friendRequests
        .findIndex(request => request.player.toString() === senderId) !== -1 
        ) {
        return cb({
            status: acknowledgementStatus.error,
            message: 'Request has already been sent.'
        })
    }
    potentialFriend.friendRequests.push({ player: senderId, seen: false })
    await potentialFriend.save()
    socket.to(potentialFriend.currentSocketId).emit(friendEvents.recieveFriendRequest, sender.username)
    cb({
        status: acknowledgementStatus.success,
        message: `Request sent to ${potentialFriend.username}.`
    })
}


export const acceptFriendRequest = async function ({ senderId, receiverId }, cb) {
    const socket = this
    try {
        const sender = await Player.findById(senderId)
        const receiver = await Player.findById(receiverId)

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

        const friendRequests = await receiver.friendRequests.filter(request => request.player.toString() !== senderId)
        receiver['friendRequests'] = friendRequests
        receiver.friends.push(senderId)
        sender.friends.push(receiverId)
        Promise.all([
            await receiver.save(),
            await sender.save()
        ])
        socket.to(sender.currentSocketId).emit(friendEvents.friendRequestAccepted, receiver.username) 
        cb({
            status: acknowledgementStatus.success,
            message: `${sender.username} is now your friend.`
        })
    } catch (error) {
        console.log(error)
    }
}

export const rejectFriendRequest = async function ({ senderId, receiverId }, cb) {
    const socket = this
    try {
        const sender = await Player.findById(senderId)
        const receiver = await Player.findById(receiverId)

        const friendRequests = await receiver.friendRequests.filter(request => {
            return request.player.toString() !== senderId
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
        socket.to(sender.currentSocketId).emit(friendEvents.friendRequestRejected, receiver.username)
        cb({
            status: acknowledgementStatus.success,
            message: `Friend request from ${sender.username} was rejected.`
        })
    } catch (error) {
        console.log(error)
    }

}