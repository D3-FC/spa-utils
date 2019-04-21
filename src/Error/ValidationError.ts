import { AppError } from './AppError'

// TODO: decouple with axios response. Make proxy exception.
export class ValidationError extends AppError {
  message!: string

  code?: string

  data: { [key: string]: string[] } | null = null

  previous?: Error

  constructor (data: Partial<ValidationError> = {}) {
    super()
    Object.assign(this, data)
  }
}
