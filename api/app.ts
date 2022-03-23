import 'reflect-metadata'
import * as http from 'http'
import { Server } from 'socket.io'
import express, { Express } from 'express'
import consola from 'consola'
import { createConnection } from 'typeorm'

import { HostController } from './controller'
import { SubscribeService } from './service/pubsubService'

export default class ServerApp {
  app: Express
  config: any
  nuxt: any
  port: number
  host: string

  httpServer: http.Server
  hostController: HostController

  sockio: Server
  pubsubService: SubscribeService

  constructor () {
    this.app = express()
    this.app.use(express.json())

    const config = require('./config.json')
    this.host = config.host
    this.port = config.port

    this.httpServer = http.createServer(this.app)
    this.hostController = new HostController()

    this.sockio = new Server(this.httpServer, {
      cors: {
        origin: "http://localhost:3000"
      }
    })
    this.pubsubService = new SubscribeService(this.sockio)
  }

  initializeRouter() {
    consola.info(`initialize router`);
    this.app.use(this.hostController.router)
  }

  async setup() {
    try {
      await createConnection()
    } catch (error) {
      consola.error(error)
      throw error
    }
    consola.info(`connected database`);

    this.initializeRouter()
  }

  listen() {
    this.httpServer.listen(this.port, this.host, () => {
      consola.log(`ServerApp listening on the port ${this.port}`)
    })

    consola.ready({
      message: `Server listening on http://${this.host}:${this.port}`,
      badge: true,
    })
  }

  async start() {
    await this.setup()
    this.listen()

    this.pubsubService.start()
  }
}