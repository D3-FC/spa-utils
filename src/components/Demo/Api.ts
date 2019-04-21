import { ApiInstance, ApiRequestConfig } from '../../modules/Api/ConfigTypes'

export class Api implements ApiInstance {
  defaults: ApiRequestConfig = {}

  async delete (url: string, config?: ApiRequestConfig): Promise<any> {
  }

  async get<T = any> (url: string, config?: ApiRequestConfig): Promise<any> {
    return undefined
  }

  async post<T = any> (url: string, data?: any, config?: ApiRequestConfig): Promise<any> {
    return undefined
  }

  async put<T = any> (url: string, data?: any, config?: ApiRequestConfig): Promise<any> {
    return undefined
  }

}
