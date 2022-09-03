import { JSONSchema7 } from 'json-schema'
import { JsonSchemaConverterFn, JsonSchemaEnrichFn, jsonToJsonSchemaFn, JsonToJsonSchemaOptions, TypeToJsonSchemaAction } from './json-to-json-schema.types'
import { camel2title, detectFormat, isObject } from './utils'

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
        ...(isObject(value[0]) && { properties: convertFn(value[0]) })
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
  },
  format: {
    enrich: (json, _key, value) => {
      const format = detectFormat(value)

      if (format) {
        json.format = format
      }
    }
  },
  required: {
    enrich: (json, _key, value) => {
      const extractedValue = Array.isArray(value) ? value[0] : value

      if (isObject(extractedValue)) {
        const objToManipulate = json.type === 'array' ? json.items : json
        const currRequired = objToManipulate.required || []

        objToManipulate.required = [...currRequired, ...Object.keys(extractedValue)]
      }
    }
  }
}

const jsonToJsonSchemaProperties: JsonSchemaConverterFn = (json, options) => {
  const keys = Object.keys(json)
  let jsonSchema: Record<string, any> = {}

  keys.forEach(key => {
    const value = json[key]
    const type = Array.isArray(json[key]) ? 'array' : typeof value as keyof typeof typeToJsonSchemaProperty
    jsonSchema = { ...jsonSchema, [key]: typeToJsonSchemaProperty[type].action(val => jsonToJsonSchemaProperties(val, options), value) }

    Object.entries(options).forEach(([option, isOptionEnabled]) => {
      if (isOptionEnabled) {
        jsonSchemaEnricher[option].enrich(jsonSchema[key], key, value)
      }
    })
  })

  return jsonSchema
}

const enrichRootJsonSchema = (jsonSchema: JSONSchema7, options: JsonToJsonSchemaOptions): void => {
  const rootEnricherKeys: Array<keyof JsonToJsonSchemaOptions> = ['required']

  rootEnricherKeys.forEach(enricherKey => {
    if (options[enricherKey]) {
      jsonSchemaEnricher[enricherKey].enrich(jsonSchema, '', jsonSchema.properties)
    }
  })
}

const jsonToJsonSchema: jsonToJsonSchemaFn = (json, options = {}) => {
  const jsonSchemaProperties = jsonToJsonSchemaProperties(json, options)
  const jsonSchema: JSONSchema7 = { properties: jsonSchemaProperties }

  enrichRootJsonSchema(jsonSchema, options)

  return jsonSchema
}

export default jsonToJsonSchema
