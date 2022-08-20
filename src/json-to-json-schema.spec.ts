import jsonToJsonSchema from './json-to-json-schema'

describe('JsonToJsonSchema', () => {
  const BASE_SCHEMA = { $schema: 'http://json-schema.org/draft-07/schema#' }

  it('should convert json with primitive values to json schema', () => {
    const json = {
      someNumber: 4,
      someString: 'some-string',
      someBoolean: false
    }

    expect(jsonToJsonSchema(json)).toStrictEqual({
      ...BASE_SCHEMA,
      properties: {
        someNumber: {
          type: 'number'
        },
        someString: {
          type: 'string'
        },
        someBoolean: {
          type: 'boolean'
        }
      }
    })
  })

  it('should convert json with object value to json schema', () => {
    const json = {
      someObject: {
        myObjectProperty: 'my-object-string'
      }
    }

    expect(jsonToJsonSchema(json)).toStrictEqual({
      ...BASE_SCHEMA,
      properties: {
        someObject: {
          type: 'object',
          properties: {
            myObjectProperty: {
              type: 'string'
            }
          }
        }
      }
    })
  })

  it('should convert json with nested object value to json schema', () => {
    const json = {
      someObject: {
        myNestedObject: {
          myNestedValue: 128
        }
      }
    }

    expect(jsonToJsonSchema(json)).toStrictEqual({
      ...BASE_SCHEMA,
      properties: {
        someObject: {
          type: 'object',
          properties: {
            myNestedObject: {
              type: 'object',
              properties: {
                myNestedValue: {
                  type: 'number'
                }
              }
            }
          }
        }
      }
    })
  })

  it('should convert json with array value of primitives to json schema', () => {
    const json = {
      someArray: [1, 2, 3, 4]
    }

    expect(jsonToJsonSchema(json)).toStrictEqual({
      ...BASE_SCHEMA,
      properties: {
        someArray: {
          type: 'array',
          items: {
            type: 'number'
          }
        }
      }
    })
  })

  it('should convert json with array of objects to json schema', () => {
    const json = {
      someArray: [{
        myArrayProperty: 'my-array-value',
        myArrayProperty2: true
      }]
    }

    expect(jsonToJsonSchema(json)).toStrictEqual({
      ...BASE_SCHEMA,
      properties: {
        someArray: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              myArrayProperty: {
                type: 'string'
              },
              myArrayProperty2: {
                type: 'boolean'
              }
            }
          }
        }
      }
    })
  })

  describe('options', () => {
    describe('examples', () => {
      it('should not add examples to json schema when examples=false', () => {
        const json = {
          someNumber: 4
        }

        expect(jsonToJsonSchema(json, { examples: false })).toStrictEqual({
          ...BASE_SCHEMA,
          properties: {
            someNumber: {
              type: 'number'
            }
          }
        })
      })

      it('should add examples to json schema when examples=true', () => {
        const json = {
          someNumber: 4,
          someString: 'some-string',
          someBoolean: false
        }

        expect(jsonToJsonSchema(json, { examples: true })).toStrictEqual({
          ...BASE_SCHEMA,
          properties: {
            someNumber: {
              type: 'number',
              examples: [4]
            },
            someString: {
              type: 'string',
              examples: ['some-string']
            },
            someBoolean: {
              type: 'boolean',
              examples: [false]
            }
          }
        })
      })

      it('should add examples to array', () => {
        const json = {
          someArray: [{
            myArrayProperty: 'my-array-value'
          },
          {
            myArrayProperty: 'my-array-value2'
          }]
        }

        expect(jsonToJsonSchema(json, { examples: true })).toStrictEqual({
          ...BASE_SCHEMA,
          properties: {
            someArray: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  myArrayProperty: {
                    type: 'string',
                    examples: ['my-array-value']
                  }
                }
              },
              examples: [{ myArrayProperty: 'my-array-value' }, { myArrayProperty: 'my-array-value2' }]
            }
          }
        })
      })
    })
  })
})
