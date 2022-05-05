/* eslint-disable */
import express from 'express'
import configFn from './webpack.config.babel'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
// import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackHotMiddleware from '@gatsbyjs/webpack-hot-middleware'
import { ApolloServer, gql } from 'apollo-server-express'
import openBrowser from 'react-dev-utils/openBrowser'

import schema from './schema.graphql'
import resolvers from './resolvers'

const typeDefs = gql(schema)

const app = express()
const PORT = process.env.PORT || 3000
const config = configFn('', 'development')
const compiler = webpack(config)

let server = null;

async function startServer() {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { foo: 'bar'},
    tracing: true,
  })
  await server.start()
  
  app.use(middleware(compiler, {
    publicPath: config.output.publicPath,
  }))
  app.use(webpackHotMiddleware(compiler, {
    log: console.log,  path: '/__webpack_hmr'
  }))

  server.applyMiddleware({ app })
}

startServer()

app.listen(PORT, () => console.log(`listening: http://localhost:${PORT}`))

openBrowser(`http://localhost:${PORT}`)
