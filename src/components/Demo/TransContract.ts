import { Dto } from '../../modules/Dto'

export interface TransContract<T> {
  fromResponse (data: Dto): T

  toRequest (user: T): Dto
}
