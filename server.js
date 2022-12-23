import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

import playerRouter from './routers/player.js'
import statsRouter from './routers/stats.js'

import onConnection from './utils/events/onConnection.js'

dotenv.config()
const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use(playerRouter)
app.use(statsRouter)

app.get('/', (req, res) => {
    res.send({ Hello: "World" })
})

io.on('connection', onConnection)

mongoose.connect(process.env.DB_URL)
    .then(() => {
        server.listen(port, () => {
            console.log(`app is listening at http://localhost:${port}`)
        })
    }).catch((e) => {
        console.log(e)
    })