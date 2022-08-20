interface JsonToJsonSchemaOptions {
  examples?: boolean
  titles?: boolean
}

const typeToJsonSchemaProperty = {
  string: {
    action: (_converterFn: (value: {[key: string]: any}) => {[key: string]: any}, _value: any) => ({
      type: 'string'
    })
  },
  boolean: {
    action: (_converterFn: (value: {[key: string]: any}) => {[key: string]: any}, _value: any) => ({
      type: 'boolean'
    })
  },
  number: {
    action: (_convertFn: (value: {[key: string]: any}) => {[key: string]: any}, _value: any) => ({
      type: 'number'
    })
  },
  array: {
    action: (convertFn: (val: {[key: string]: any}) => {[key: string]: any}, value: any) => ({
      type: 'array',
      items: {
        type: typeof value[0],
        ...(typeof value[0] === 'object' && !Array.isArray(value[0]) && { properties: convertFn(value[0]) })
      }
    })
  },
  object: {
    action: (convertFn: (value: {[key: string]: any}) => {[key: string]: any}, value: any) => ({
      type: 'object',
      properties: convertFn(value)

    })
  }
}

type JsonSchemaConverterFn = (json: {[key: string]: any}, options: JsonToJsonSchemaOptions) => {[key: string]: any}
const jsonToJsonSchemaProperties: JsonSchemaConverterFn = (json, options) => {
  const keys = Object.keys(json)
  let jsonSchema: {[key: string]: any} = {}

  keys.forEach(key => {
    const value = json[key]
    const type = Array.isArray(value) ? 'array' : typeof value as keyof typeof typeToJsonSchemaProperty
    jsonSchema = { ...jsonSchema, [key]: typeToJsonSchemaProperty[type].action((val: {[key: string]: any}) => jsonToJsonSchemaProperties(val, options), value) }

    if (options.examples) {
      jsonSchema[key].examples = Array.isArray(value) ? value : [value]
    }
  })

  return jsonSchema
}

const jsonToJsonSchema = (json: {[key: string]: any}, options: JsonToJsonSchemaOptions = {}): {[key: string]: any} => {
  const baseJsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#'
  }
  const jsonSchemaProperties = jsonToJsonSchemaProperties(json, options)

  return {
    ...baseJsonSchema,
    properties: jsonSchemaProperties
  }
}

export default jsonToJsonSchema
