import 'dotenv/config'
import express from 'express'
import payload from 'payload'
import { MongoMemoryServer } from 'mongodb-memory-server'
import config from './payload.config.mjs'

const app = express()

const start = async () => {
  const mongod = await MongoMemoryServer.create({ binary: { version: '7.0.14' } })
  const uri = mongod.getUri()
  process.env.MONGODB_URI = process.env.MONGODB_URI || uri
  process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || 'dev-secret'

  await payload.init({ express: app, config: { ...config, secret: 'dev-secret' } })
  app.listen(3000, () => {
    console.log('Payload CMS running at http://localhost:3000/admin')
  })
}

start()
