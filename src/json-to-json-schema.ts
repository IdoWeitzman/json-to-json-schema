import { JsonSchemaConverterFn, JsonSchemaEnrichFn, JsonToJsonSchemaOptions, TypeToJsonSchemaAction } from './json-to-json-schema.types'
import { camel2title } from './utils'

const typeToJsonSchemaProperty: Record<string, {action: TypeToJsonSchemaAction}> = {
  string: {
    action: (_converterFn, _value) => ({
      type: 'string'
    })
  },
  boolean: {
    action: (_converterFn, _value) => ({
      type: 'boolean'
    })
  },
  number: {
    action: (_convertFn, _value) => ({
      type: 'number'
    })
  },
  array: {
    action: (convertFn, value) => ({
      type: 'array',
      items: {
        type: typeof value[0],
        ...(typeof value[0] === 'object' && !Array.isArray(value[0]) && { properties: convertFn(value[0]) })
      }
    })
  },
  object: {
    action: (convertFn, value) => ({
      type: 'object',
      properties: convertFn(value)

    })
  }
}

const jsonSchemaEnricher: Record<string, {enrich: JsonSchemaEnrichFn}> = {
  examples: {
    enrich: (json, _key, value) => {
      json.examples = Array.isArray(value) ? value : [value]
    }
  },
  titles: {
    enrich: (json, key, _value) => {
      json.title = camel2title(key)
    }
  }
}

const jsonToJsonSchemaProperties: JsonSchemaConverterFn = (json, options) => {
  const keys = Object.keys(json)
  let jsonSchema: Record<string, any> = {}

  keys.forEach(key => {
    const value = json[key]
    const type = Array.isArray(value) ? 'array' : typeof value as keyof typeof typeToJsonSchemaProperty
    jsonSchema = { ...jsonSchema, [key]: typeToJsonSchemaProperty[type].action(val => jsonToJsonSchemaProperties(val, options), value) }

    Object.entries(options).forEach(([option, isOptionEnabled]) => {
      if (isOptionEnabled) {
        jsonSchemaEnricher[option].enrich(jsonSchema[key], key, value)
      }
    })
  })

  return jsonSchema
}

const jsonToJsonSchema = (json: Record<string, any>, options: JsonToJsonSchemaOptions = {}): Record<string, any> => {
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
