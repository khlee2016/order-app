import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import menusRouter from './routes/menus.js'
import ordersRouter from './routes/orders.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/menus', menusRouter)
app.use('/api/orders', ordersRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
})
