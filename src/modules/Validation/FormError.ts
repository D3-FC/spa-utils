import ValidationErrorCollection from './ValidationErrorCollection'

export class FormError {
  message: string = ''

  type: string = ''

  data: ValidationErrorCollection = new ValidationErrorCollection({})

  constructor (data: Partial<FormError> = {}) {
    Object.assign(this, data)
  }

  toString () {
    return this.message
  }

  clear (key?: string): this {
    this.message = ''
    this.type = ''
    if (key) {
      this.data.clearFor(key)
    }
    if (!key) {
      this.data.clearCollection()
    }
    return this
  }

  addError (key: string, value: string[]): this {
    this.data.addError(key, value)
    return this
  }

  get hasErrors (): boolean {
    return this.data.hasError
  }

  getErrors (key: string): string | string[] {
    return this.data.getFor(key)
  }

  getError (key: string): string | string {
    const errors = this.getErrors(key)
    return errors ? errors[0] : ''
  }
}
