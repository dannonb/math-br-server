import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { Configuration, OpenAIApi } from "openai";

import runScheduledCleanupTasks from './utils/functions/scheduledTasks.js'


import playerRouter from './routers/player.js'
import statsRouter from './routers/stats.js'

import onConnection from './utils/events/onConnection.js'

import { socketAuth } from './middleware/socketMiddleware.js'

dotenv.config()

const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

// authorization for socket requests
io.use(socketAuth)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use(playerRouter)
app.use(statsRouter)

app.get('/', (req, res) => {
    res.send({ Hello: "World" })
})

mongoose.connect(process.env.DB_URL)
    .then(() => {
        server.listen(port, () => {
            console.log(`app is listening at http://localhost:${port}`)
        })
        io.on('connection', onConnection)
        runScheduledCleanupTasks()
    }).catch((e) => {
        console.log(e)
    })