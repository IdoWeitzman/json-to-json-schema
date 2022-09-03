<h1>json-to-json-schema</h1>
Converts JSON to it's corresponsing JSON schema.

## Features
1. Convert JSON to JSON schema
2. Enrich the converted JSON schema with:
   * `title` - generate title for each property
   * `required` - mark each fields as required
   * `examples` - generate examples for each property
   * `format` - detect format for relevant properties (supported formats: `uuid`, `email`, `uri`, `date`, `time`)

## Installation

npm:
```
npm i @idowei/json-to-json-schema
```

yarn:
```
yarn add @idowei/json-to-json-schema
```

## Usage

```js
import jsonToJsonSchema from '@idowei/json-to-json-schema'

const json = {
  userId: '07b84a8a-7fa3-467c-8129-e6e0dcdd5a40',
  userName: "John Doe",
  lastLoginDate: "2020-01-01T00:00:00.000Z",
  email: "john.doe@gmail.com",
}

const jsonSchema = jsonToJsonSchema(json, { 
  examples: true, 
  titles: true, 
  format: true, 
  required: true 
});
```

For the above example the following json schema is generated:

```js
{
   properties: {
     userId: {
       type: 'string',
       examples: ['07b84a8a-7fa3-467c-8129-e6e0dcdd5a40'],
       title: 'User Id',
       format: 'uuid'
     },
     userName: { type: 'string', examples: ['John Doe'], title: 'User Name' },
     lastLoginDate: {
       type: 'string',
       examples: ['2020-01-01T00:00:00.000Z'],
       title: 'Last Login Date',
       format: 'date-time'
     },
     email: {
       type: 'string',
       examples: ['john.doe@gmail.com'],
       title: 'Email',
       format: 'email'
     }
   },
   required: ['userId', 'userName', 'lastLoginDate', 'email']
}
```

### Parameters

```typescript
type jsonToJsonSchema = (json: Record<string, any>, options?: JsonToJsonSchemaOptions) => JSONSchema7
```

`json: Record<string, any>` - JSON object
<br/> <br/>
`options: JsonToJsonSchemaOptions` - optional options object with the following properties:
Key        | Type          | Default value | Description
---        | --------      | ----          | ---------
`titles`   | `boolean`     | `false`       | Generates title for each property.
`required` | `boolean`     | `false`       | Marks each property as required.
`examples` | `boolean`     | `false`       | Generates examples for each property.
`format`   | `boolean`     | `false`       | detects format for each property and adds it (if found). for an example check out Usage section.
