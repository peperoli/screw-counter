import express from 'express'
import ViteExpress from 'vite-express'
import bodyParser from 'body-parser'
import { mqttClient } from './mqttClient'
import { Server as SocketIOServer } from 'socket.io'
import http from 'http'

const app = express()
const server = http.createServer(app.listen(3000))
app.use(bodyParser.urlencoded())
const io = new SocketIOServer(server, {
  cors: { origin: '*' }, // adjust for production
})

app.get('/hello', (_, res) => {
  res.send('Hello Vite + React + TypeScript!')
})

const client = mqttClient()
const TOPIC = 'screwCounter_currentCount'

app.post('/api/start-counter', (req, res) => {
  const amount = req.body?.amount as string | undefined

  try {
    if (!amount) {
      throw new Error('Bitte eine Menge angeben')
    }

    client.publish('screwCounter_targetCount', amount)

    res.redirect(`/?amount=${amount}`)
  } catch (error) {
    console.error(error)
    const searchParams = new URLSearchParams({
      error: 'true',
      message: error instanceof Error ? error.message : 'Unbekannter Fehler',
    })
    res.redirect('/?' + searchParams.toString())
  }
})

client.on('connect', () => {
  client.subscribe(TOPIC, err => {
    if (err) console.error('Subscribe error:', err)
    else console.log(`Subscribed to ${TOPIC}`)
  })
})

client.on('message', (topic, payload) => {
  const msg = payload.toString() // usually a string or JSON
  console.log(`${topic}: ${msg}`)

  // Broadcast to all connected browsers
  io.emit('mqtt-message', { topic, payload: msg })
})

// ---------- Socket.IO ----------
io.on('connection', socket => {
  console.log('Client connected', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id)
  })
})

ViteExpress.bind(app, server)
