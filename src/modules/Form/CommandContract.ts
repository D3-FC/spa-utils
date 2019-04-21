export interface CommandContract {
  isRunning: boolean

  run (...args: any): Promise<any>
}
