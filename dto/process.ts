export interface ProcessTableItem {
  hostName: string
  serverName: string
  processName: string
  processingTime: number
  threadId: number
  receiveTime: string
  receiveTimeText: string
  alive: boolean
}

export interface ProcessResponse {
  hostName: string
  serverName: string
  processName: string
  processingTime: number
  threadId: number
  receiveTime: string
}

export interface ProcessInfo extends ProcessResponse {
  alive: boolean
  processingTime: number
  threadId: number
  lastReceiveTime: string
}

export interface ProcessKillRequest {
  hostName: string
  serverName: string
  killCommand: string
}

interface ProcessKillResult {
  serverName: string
  exitCode: number
  close: boolean
}

export interface ProcessKillResponse {
  servers: ProcessKillResult[]
}
