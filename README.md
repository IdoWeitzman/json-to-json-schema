<h1>json-to-json-schema</h1>
Converts JSON to it's corresponsing JSON schema.

## Usage

```
import jsonToJsonSchema from 'json-to-json-schema'

const json = {
  userId: '07b84a8a-7fa3-467c-8129-e6e0dcdd5a40',
  userName: "John Doe",
  lastLoginDate: "2020-01-01T00:00:00.000Z",
  email: "john.doe@gmail.com",
}

const jsonSchema = jsonToJsonSchema(json, { examples: true, titles: true, format: true });
```

For the above example the following json schema is generated:

```
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
   }
}
```

### Parameters

```
type jsonToJsonSchema = (json: Record<string, any>, options: JsonToJsonSchemaOptions) => Record<string, any>

export interface JsonToJsonSchemaOptions {
  examples?: boolean // genereates examples for each property
  titles?: boolean   // generates title for each property
  format?: boolean   // detects format to each property and adds it, if found
}
```
