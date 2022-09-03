export const camel2title: (camelCase: string) => string = (camelCase) => {
  const result = camelCase
    .replace(/(_)+/g, ' ')
    .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([A-Z][a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2')
    .replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2')

    .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2')
    .replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2')

    .replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2')
    .replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2')
    .trim()

  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const detectFormat = (value: any): string | undefined => {
  const regExpressions: Record<string, RegExp> = {
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    uri: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
    'date-time': /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/,
    date: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
    time: /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/
  }
  let format: string | undefined

  Object.entries(regExpressions)
    .forEach(([key, regExp]) => {
      if (regExp.test(value)) {
        format = key
      }
    })

  return format
}

export const isObject = (value: any): boolean =>
  typeof value === 'object' &&
  !Array.isArray(value) &&
  value !== null
