import express from 'express'
import ViteExpress from 'vite-express'
import mqtt from 'mqtt'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.urlencoded())

app.get('/hello', (_, res) => {
  res.send('Hello Vite + React + TypeScript!')
})

app.post('/api/start-counter', (req, res) => {
  const amount = req.body?.amount as string | undefined

  try {
    if (!amount) {
      throw new Error('Bitte eine Menge angeben')
    }

    const options = {
      host: '761aa76a827b4185897045398392da71.s1.eu.hivemq.cloud',
      port: 8883,
      protocol: 'mqtts',
      username: 'screw-counter-web',
      password: '8p2v3Wn3JIu4',
    } as const

    const client = mqtt.connect(options)

    client.on('connect', function () {
      console.log('Connected')
    })

    client.on('error', function (error) {
      console.error(error)

      throw error
    })

    client.on('message', function (topic, message) {
      console.log('Received message:', topic, message.toString())
    })

    client.subscribe('hello')

    client.publish('hello', amount)

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

ViteExpress.listen(app, 3000, () => console.log('Server is listening on port 3000...'))
