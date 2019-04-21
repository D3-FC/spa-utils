export default interface FormErrorContract {

  clear (key?: string): this

  addError (key: string, value: string[]): this

  getErrors (key: string): string | string[]

  getError (key: string): string | string

  hasErrors: boolean
}
