'use strict';
 
import { graphql } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from '../schema.graphql'
import resolvers from '../resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

exports.handler = (event, context, callback) => {
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
    context.callbackWaitsForEmptyEventLoop = false
    
    const { query, variables, operationName } = JSON.parse(event.body)
    const root = {}
    const ctx = {}

    graphql(schema, query, root, ctx, variables, operationName)
      .then(d => {
        callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(d),
        })
      })
      .catch(err => {
        callback(null, {
          statusCode: 503,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(err),
        })
      })
  
}