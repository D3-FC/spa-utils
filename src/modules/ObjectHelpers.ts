import { Dto } from './Dto'
import { toCamelCase, toSnakeCase } from './StringHelpers'

export function objectPropsToCamelCase (data: Dto): Dto | Dto[] {
  if (Array.isArray(data)) {
    return data.map(
      (value) => {
        if (!value || !(typeof value === 'object')) return value
        return objectPropsToCamelCase(value)
      })
  }

  const props = Object.keys(data)
  const result: Dto = {}
  props.forEach((prop: string) => {
    const camelCaseProp = toCamelCase(prop)
    const propValue = data[prop]

    if (!propValue) {
      result[camelCaseProp] = propValue
      return
    }

    if (typeof propValue === 'object') {
      result[camelCaseProp] = objectPropsToCamelCase(propValue)
      return
    }

    result[camelCaseProp] = propValue
  })

  return result
}

export function objectPropsToSnakeCase (data: Dto | Dto[]): Dto | Dto[] {
  if (Array.isArray(data)) {
    return data.map(
      (value) => {
        if (!value || !(typeof value === 'object')) return value
        return objectPropsToSnakeCase(value)
      })
  }

  const props = Object.keys(data)
  const result: Dto = {}
  props.forEach((prop: string) => {
    const kebabCaseProp = toSnakeCase(prop)
    const propValue = data[prop]

    if (!propValue) {
      result[kebabCaseProp] = propValue
      return
    }
    if (typeof propValue === 'object') {
      result[kebabCaseProp] = objectPropsToSnakeCase(propValue)
      return
    }

    result[kebabCaseProp] = propValue
  })
  return result
}
