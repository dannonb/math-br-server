import { socketEvents } from '../constants.js'
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest 
} from './eventhandlers/friendEvents.js'

const { friendEvents } = socketEvents

const registerEvents = (socket) => {
    // friend events
    socket.on(friendEvents.sendFriendRequest, sendFriendRequest)
    socket.on(friendEvents.acceptFriendRequest, acceptFriendRequest)
    socket.on(friendEvents.rejectFriendRequest, rejectFriendRequest)

    // custom game events
}

export default registerEvents;