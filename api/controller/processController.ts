
import consola from 'consola'
import { Router, Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import axios from 'axios'
import { ServerProcess } from '../entity/ServerProcess'
import { HostServer } from '../entity/HostServer'
import { asyncWrap } from '.'
import { IRequestProcessKill, IResponseProcessKill } from '~/interface/serverProcess'


export class ProcessController {
  router: Router

  constructor() {
    this.router = Router()
    this.router.get('/process', asyncWrap(this.all))
    this.router.put('/process/kill', asyncWrap(this.kill))
  }

  async all(_req: Request, res: Response, _nex: NextFunction) {
    try {
      const serverProcess = await getRepository(ServerProcess).find()
      res.status(200).json(serverProcess)
    } catch (error) {
      consola.error(`${error}`)
      res.status(503).json({error: `"${error}"`})
    }
  }

  async kill(req: Request, res: Response, _nex: NextFunction) {
    try {
      const reqBody = req.body as IRequestProcessKill

      const hostServer = await getRepository(HostServer)
        .createQueryBuilder('HostServer')
        .where('HostServer.HostName = :hostName', {hostName: reqBody.hostName})
        .getOne()

      // check undefined
      if (hostServer === undefined) {
        consola.error(`invalid HostName '${reqBody.hostName}'`)
        res.status(400).json({})
        return;
      }

      const serverProcess = await getRepository(ServerProcess)
        .createQueryBuilder()
        .where('ServerProcess.HostName = :hostName', {hostName: reqBody.hostName})
        .andWhere('ServerProcess.ServerName = :serverName', {serverName: reqBody.serverName})
        .getOne()

      if (serverProcess === undefined) {
        consola.error(`invalid ServerName '${reqBody.serverName}' in '${reqBody.hostName}'`)
        res.status(400).json({})
        return;
      }

      const response = await axios.put<IResponseProcessKill>(
        `http://${hostServer.ipAddr}/server/process/kill`, {
          killCommand: reqBody.killCommand,
          serverName: reqBody.serverName,
        })

      res.status(response.status).json(response.data)
    } catch (error) {
      consola.error(`${error}`)
      res.status(503).json({error: `"${error}"`})
    }
  }
}
