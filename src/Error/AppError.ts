import { Dto } from '../modules/Dto'

export class AppError extends Error {
  message: string = 'Woops! Something went wrong. :('

  constructor (data: Dto = {}) {
    super()
  }
}
