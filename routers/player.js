import express from 'express'

import { openai } from '../server.js'

import auth from '../middleware/auth.js'
import Player from '../models/player.js'
import Stats from '../models/stats.js'
const router = new express.Router()

router.post('/players/register', async (req, res) => {
    const player = new Player(req.body)
    const stats = new Stats({ player: player._id })
    try {
        Promise.all([
            await player.save(),
            await stats.save(),
            await player.populate('stats')
        ])
        const token = await player.generateAuthToken()
        console.log("PLAYER: ", player)
        console.log("STATS: ", player.stats)
        res.status(201).send({ player, token })
    } catch (e) {
        if (e._message) {
            res.status(400).send({ error: e._message })
        } else if (e.code === 11000) {
            res.status(400).send({ error: `${e.keyValue.username} is already taken` })
        }

    }
})

router.post('/players/login', async (req, res) => {
    try {
        const player = await Player.findByCredentials(req.body.username, req.body.password).populate('stats')
        const token = await player.generateAuthToken()
        res.status(200).send({ player, token })
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
        res.status(500).send({error: e.message})
    }
})

router.post('/players/logout-all', auth, async (req, res) => {
    try {
        req.player.tokens = []
        await req.player.save()
        res.send()
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.get('/players/profile', auth, async (req, res) => {
    try {
        const player = await req.player.populate('stats')
        console.log(req.player)
        res.send({ player })
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.get('/players/friends', auth, async (req, res) => {
    try {
        const player = await req.player.populate('friends')
        res.status(200).send({ friends: player.friends })
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.get('/players/friends/:id', auth, async (req, res) => {
    try {
        const player = await req.player.populate('friends')
        res.status(200).send({ friends: player.friends })
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.patch('/players/generate-profile-image', auth, async (req, res) => {
    try {
        const openaiResponse = await openai.createImage({
            prompt: "green cartoon person doing math",
            n: 1,
            size: "256x256",
          });
        const image_url = openaiResponse.data.data[0].url
        req.player.profileImageUrl = image_url
        await req.player.save()
        res.status(200).send(req.player)
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send({ error: error.response.data })
          } else {
            res.status(500).send({ error: error.message })
          }
    }
})

router.get('/players/testpic', async (req, res) => {
    try {
        const openaiResponse = await openai.createImage({
            prompt: "background for math and logic game",
            n: 1,
            size: "1024x1024",
          });
        const image_url = openaiResponse.data.data[0].url 
        res.send(image_url) 
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send({ error: error.response.data })
          } else {
            res.status(500).send({ error: error.message })
          }
    }
})

export default router