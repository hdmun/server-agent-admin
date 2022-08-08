export interface HostMachineResponse {
  hostName: string
  ipAddr: string
  alive: boolean
}

export interface MonitoringRequest {
  hostName: string
  monitoring: boolean
}

export interface MonitoringResponse {
  hostName: string
  on: boolean
}

export interface HostMachineTableItem extends HostMachineResponse {
  monitoring?: boolean
  aliveAckTime?: Date
  aliveAckText?: string
}