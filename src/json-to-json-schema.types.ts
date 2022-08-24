export interface JsonToJsonSchemaOptions {
  examples?: boolean
  titles?: boolean
}

export type JsonSchemaConverterFn = (json: Record<string, any>, options: JsonToJsonSchemaOptions) => Record<string, any>

export type TypeToJsonSchemaAction = (converterFn: (value: Record<string, any>) => Record<string, any>, value: any) => Record<string, any>

export type JsonSchemaEnrichFn = (json: Record<string, any>, value: any) => void
