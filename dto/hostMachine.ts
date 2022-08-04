export interface HostMachineResponse {
  hostName: string
  ipAddr: string
}

export interface MonitoringRequest {
  hostName: string
  monitoring: boolean
}

export interface HostMachineTableItem extends HostMachineResponse {
  monitoring?: boolean
  alive?: boolean
  aliveAckTime?: Date
  aliveAckText?: string
}