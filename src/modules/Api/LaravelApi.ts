import { ApiContract } from './ApiContract'
import { Dto } from '../Dto'
import { ApiInstance, ApiProxyError, ApiRequestConfig } from './ConfigTypes'
import { ApiError } from '../../Error/ApiError'
import { NetworkError } from '../../Error/NetworkError'
import { UnauthorizedError } from '../../Error/UnauthorizedError'
import { NotFoundError } from '../../Error/NotFoundError'
import { objectPropsToCamelCase, objectPropsToSnakeCase } from '../ObjectHelpers'
import { ValidationError } from '../../Error/ValidationError'

export class LaravelApi implements ApiContract {
  private readonly api: ApiInstance

  constructor (api: ApiInstance) {
    this.api = api
  }

  transformData (data: Dto) {
    return objectPropsToSnakeCase(data)
  }

  async delete (url: string, data?: Dto): Promise<any> {
    data = data ? this.transformData(data) : undefined // TODO: write tests
    return this.handleAction(() => this.api.delete(url, data))
  }

  async get (url: string, data?: Dto, config?: ApiRequestConfig): Promise<any> {
    return this.handleAction(() => this.api.get(url, {
      ...config,
      params: data ? this.transformData(data) : undefined // TODO: write tests
    }))
  }

  async post (url: string, data?: Dto, config?: ApiRequestConfig): Promise<any> {
    data = data ? this.transformData(data) : undefined // TODO: write tests
    return this.handleAction(() => this.api.post(url, data, config))
  }

  async put (url: string, data?: Dto, config?: ApiRequestConfig): Promise<any> {
    data = data ? this.transformData(data) : undefined // TODO: write tests
    return this.handleAction(() => this.api.put(url, data, config))
  }

  setToken (token: string): void {
    // NOTE: api is the singleton so we are using it like storage.
    // This is the hack, but we have no idea how to make other way. We don`t want to send token manually each time.
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  async handleAction (cb: Function, noWrapper: boolean = false) {
    let response = null
    try {
      response = await cb()
    } catch (exception) {
      const exceptionResponse = exception && exception.response
      const data = exceptionResponse && exceptionResponse.data
      const status = exceptionResponse && exceptionResponse.status

      if (this.isValidationError(exception)) {
        return new ValidationError({
          message: data.message,
          code: data.code,
          data: data.errors,
          previous: exception
        })
      }

      if (status === 401) {
        throw new UnauthorizedError({
          error: data.error,
          description: data.message,
          previous: exception,
          data: data._data
        })
      }

      if (status === 404) {
        throw new NotFoundError({
          previous: exception,
          data: data._data
        })
      }

      if (exception.response) {
        throw new ApiError({
          message: data.message
        })
      }

      if (this.isNetworkErrorException(exception)) {
        throw new NetworkError({
          message: exception.message
        })
      }

      throw exception
    }
    // TODO: write tests
    if (response && response._data && response._data._data) {
      const data = response._data._data
      if (Array.isArray(data)) {
        return data.map(item => objectPropsToCamelCase(item))
      }
      return objectPropsToCamelCase(response._data._data)
    }
    return objectPropsToCamelCase(response._data)
  }

  isValidationError (exception: any) {
    const status = exception && exception.response && exception.response.status
    return status === 422
  }

  private isNetworkErrorException (error: ApiProxyError) {
    return error.message === 'Network Error'
  }

  private isApiException (error: ApiProxyError) {
    return !!error.response
  }
}
