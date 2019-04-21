import { PropertyError } from './PropertyError'
import { toCamelCase } from '../StringHelpers'
import { Dto } from '../Dto'

export default class ValidationErrorCollection {
  errors: PropertyError[] = []

  constructor (data = {}) {
    Object.assign(this, data)
  }

  getFor (field: string): string|string[] {
    const validationError = this.errors.find(
      error => error.key === field || error.key === `${field}_id`)
    return validationError ? validationError.value : []
  }

  clearFor (field = '') {
    const validationError = this.errors.find(
      error => error.key === field || error.key === `${field}_id`)
    if (validationError) {
      validationError.value = []
    }
  }

  clear () {
    this.errors = []
  }

  static createFromLaravelError (data: Dto) {
    let errors = Object.keys(data).map(key => {
      const value = data[key]
      return new PropertyError({ key: key, value })
    })
    return new ValidationErrorCollection({ errors })
  }

  addError (key: string, value: string[]) {
    this.errors.push(new PropertyError({ key, value }))
  }

  clearCollection () {
    this.errors = []
  }

  get hasError () {
    return !!this.errors.length
  }
}
