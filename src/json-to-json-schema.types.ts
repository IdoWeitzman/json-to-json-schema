import { JSONSchema7 } from 'json-schema'
export interface JsonToJsonSchemaOptions {
  examples?: boolean
  titles?: boolean
  format?: boolean
  required?: boolean
}

export type jsonToJsonSchemaFn = (json: Record<string, any>, options?: JsonToJsonSchemaOptions) => JSONSchema7

export type JsonSchemaConverterFn = (json: Record<string, any>, options: JsonToJsonSchemaOptions) => Record<string, any>

export type TypeToJsonSchemaAction = (converterFn: (value: Record<string, any>) => Record<string, any>, value: any) => Record<string, any>

export type JsonSchemaEnrichFn = (json: Record<string, any>, key: string, value: any) => void
