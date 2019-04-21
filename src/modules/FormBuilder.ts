import { CommandContract } from './Form/CommandContract'
import { Dto } from './Dto'
import { FormError } from './Validation/FormError'
import { CommandCallback } from './Command/Command'
import Form from './Form/Form'

type Constructor = {
  new (...args: any[]): any;
}

export class FormBuilder<T> {
  CommandClass: Constructor
  mapError: ((e: Dto) => FormError)
  data: any

  constructor (commandClass: Constructor, mapError: (e: any) => FormError) {
    this.CommandClass = commandClass
    this.mapError = mapError
  }

  for<T> (data: T): FormBuilder<T> {
    this.data = data
    return this
  }

  handle<T> (commandOrCb: CommandContract | CommandCallback): Form<T> {
    if (typeof commandOrCb === 'function') {
      commandOrCb = new this.CommandClass(commandOrCb)
    }

    return new Form<T>(
      <CommandContract>commandOrCb,
      this.mapError,
      this.data
    )
  }

}
