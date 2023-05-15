import schedule from 'node-schedule'
import Game from '../../models/game.js'

const runScheduledCleanupTasks = () => {
    schedule.scheduleJob('cleanupCustomGames', '0 * * * *', async function() {
        await Game.cleanupUnplayedCustomGames()
    })

    schedule.scheduleJob('cleanupFinshedGames', '*/30 * * * *', async function() {
        await Game.cleanupFinishedGames()
    })
}

export default runScheduledCleanupTasks