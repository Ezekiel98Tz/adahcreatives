require('dotenv').config()
const express = require('express')
const payload = require('payload')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = express()

const start = async () => {
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  process.env.MONGODB_URI = process.env.MONGODB_URI || uri

  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-secret',
    express: app,
    config: require('./payload.config.js'),
  })

  app.listen(3000, () => {
    console.log('Payload CMS running at http://localhost:3000/admin')
  })
}

start()
