export interface CronOption {
  active: boolean,
  pattern: string,
  overlap?: number
  runOnInit?: boolean
  name?: string
}

export interface DebugData {
  getNextExecuteAt: Function
  getLastExecuteAt: Function
  getLastExecuteIn: Function
  checkIsRunning: Function
  getCurrentOverlap: Function
  isRunOnInit: boolean
  maxOverlap: number
  cronTime: string
  name: string
  bindTo: string
  description: string
}
