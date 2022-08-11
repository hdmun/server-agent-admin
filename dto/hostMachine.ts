export interface HostMachineResponse {
  hostName: string
  ipAddr: string
  alive: boolean
  monitoring: boolean
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
  aliveAckTime?: Date
  aliveAckText?: string
}