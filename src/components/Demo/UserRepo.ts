import { ApiContract } from '../../modules/Api/ApiContract'
import { User } from './User'
import { TransContract } from './TransContract'

export class UserRepo {
  api: ApiContract
  trans: TransContract<User>

  constructor (api: ApiContract, trans: TransContract<User>) {
    this.api = api
    this.trans = trans
  }

  async save (user: User): Promise<User> {
    const payload = this.trans.toRequest(user)
    const r = await this.api.post('/users', payload)
    return this.trans.fromResponse(r)

  }
}
