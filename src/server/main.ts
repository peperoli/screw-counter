import express from 'express'
import ViteExpress from 'vite-express'

const app = express()

app.get('/hello', (_, res) => {
  res.send('Hello Vite + React + TypeScript!')
})

// API route to get current state
app.get('/api/get-current-state', (req, res) => {
  // Replace the object below with your actual state logic
  const currentState = {
    status: 'ok',
    timestamp: Date.now(),
  }
  res.json(currentState)
})

ViteExpress.listen(app, 3000, () => console.log('Server is listening on port 3000...'))
