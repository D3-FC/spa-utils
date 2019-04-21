import { Dto } from '../../modules/Dto'
import { User } from './User'
import { TransContract } from './TransContract'

export class UserTrans implements TransContract<User> {

  fromResponse (data: Dto): User {
    return new User(data)
  }

  toRequest (user: User): Dto {
    return user
  }
}
