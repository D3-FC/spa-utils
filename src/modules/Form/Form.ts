import { CommandContract } from './CommandContract'
import { clone } from '../CloneHelpers'
import { FormError } from '../Validation/FormError'
import { Dto } from '../Dto'
import FormErrorContract from './FormErrorContract'

type Constructor = {
  new (...args: any[]): any;
}

export default class Form<T = any> {
  protected _data: T

  protected _snapshot: any

  protected command: CommandContract

  protected error: FormErrorContract = new FormError()

  protected resetOnSuccess: boolean = false

  protected mapError: (e: Dto) => FormErrorContract

  constructor (command: CommandContract, mapError: (e: any) => FormErrorContract, data: T) {
    this.command = command
    this.mapError = mapError
    this._data = data
    this.snapshot(data)
  }

  get isRunning (): boolean {
    return this.command.isRunning
  }

  get data (): T {
    return this._data
  }

  async submit (...args: any): Promise<any> {
    try {
      const result = await this.command.run(args)
      this.reset()
      return result
    } catch (e) {
      this.error = this.mapError(e)

      throw e
    }
  }

  enableAutoReset (): this {
    this.resetOnSuccess = true
    return this
  }

  disableAutoReset (): this {
    this.resetOnSuccess = true
    return this
  }

  snapshot (data: any): this {
    if (data) {
      this._snapshot = clone(data)
      return this
    }

    this._snapshot = clone(this._data)
    return this
  }

  get wasChanged (): boolean {
    return JSON.stringify(this._data) !== JSON.stringify(this._snapshot)
  }

  reset (): this {
    this._data = clone(this._snapshot)
    this.error.clear()
    return this
  }

  clearErrors (key?: string): this {
    this.error.clear(key)
    return this
  }

  addError (key: string, value: string[]): this {
    this.error.addError(key, value)
    return this
  }

  hasErrors (): boolean {
    return this.error.hasErrors
  }

  getErrors (key: string): string | string[] {
    return this.error.getErrors(key)
  }

  getError (key: string): string | string {
    return this.error.getError(key)
  }
}
