export type CommandCallback = (...args: any[]) => Promise<any>

export default class Command {
  protected readonly cb: CommandCallback

  /**
   * Currently running cbs
   */
  public runCount: number = 0 //

  /**
   * Last executor run happened without an error
   */
  public wasLastRunFine: boolean = false //

  /**
   * Executor was run at least once
   */
  public wasRun: boolean = false

  /**
   * Executor was run without throwing error at least once
   */
  public wasRunFine: boolean = false

  /**
   * Executor was run with thrown error at least once
   */
  public wasRunBad: boolean = false

  constructor (cb: CommandCallback) {
    this.cb = cb
  }

  static createAndRun (cb: CommandCallback): Command {
    const executor = new Command(cb)
    executor.run()
    return executor
  }

  /**
   * Command from this executor is currently running.
   */
  public get isRunning (): boolean {
    return !!this.runCount
  }

  /**
   * @param parameters Arguments, will be passed down to cb.
   * @returns {Promise<any>} Promise result is formed from whatever you returned from cb.
   */
  public run (...parameters: any[]): Promise<any> {
    this.beforeRun()
    const promise = this.cb(...parameters)
    // NOTE This check was broken on second package import (package one < package two < executor)
    // if (!(promise instanceof Promise)) {
    //   throw new Error('Executor cb should return promise.')
    // }
    this.afterRun(promise)
    return promise
  }

  protected beforeRun (): void {
    this.runCount++
  }

  protected afterRun (promise: Promise<any>): void {
    promise.then(() => {
      this.runCount--
      this.setRunResultFlags(true)
    })
    promise.catch(() => {
      this.runCount--
      this.setRunResultFlags(false)
    })
  }

  protected setRunResultFlags (success: boolean): void {
    this.wasRun = true
    this.wasLastRunFine = success
    if (success) {
      this.wasRunFine = true
    }
    if (!success) {
      this.wasRunBad = true
    }
  }
}
