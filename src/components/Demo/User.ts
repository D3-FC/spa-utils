export class User {
  name = ''
  surname = ''

  constructor (data: Partial<User> = {}) {
    Object.assign(this, data)
  }
}
