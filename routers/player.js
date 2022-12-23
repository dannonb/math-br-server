import express from 'express'

import auth from '../middleware/auth.js'
import Player from '../models/player.js'
import Stats from '../models/stats.js'
const router = new express.Router()

router.post('/players/signup', async (req, res) => {
    const player = new Player(req.body)
    const stats = new Stats({ player: player._id })
    try {
        await player.save()
        await stats.save()
        const token = await player.generateAuthToken()
        res.status(201).send({ player, token })
    } catch (e) {
        console.log(e)
        if (e._message) {
            res.status(400).send({ error: e._message })
        } else if (e.code === 11000) {
            res.status(400).send({ error: `${e.keyValue.username} is already taken` })
        }

    }
})

router.post('/players/login', async (req, res) => {
    try {
        const player = await Player.findByCredentials(req.body.username, req.body.password)
        const token = await player.generateAuthToken()
        console.log('logging player')
        res.send({ player, token })
    } catch (e) {
        res.status(400).send({ error: e._message })
    }
})

router.post('/players/logout', auth, async (req, res) => {
    try {
        req.player.tokens = req.player.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.player.save()

        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/players/logoutAll', auth, async (req, res) => {
    try {
        req.player.tokens = []
        await req.player.save()
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/players/profile', auth, async (req, res) => {
    try {

    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/players/friends', auth, async (req, res) => {
    try {
        const player = await req.player.populate('friends')
        res.status(200).send({ friends: player.friends })
    } catch (e) {
        res.status(500).send(e.message)
    }
})

export default router