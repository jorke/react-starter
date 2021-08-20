import React from 'react'
import ReactDOM from 'react-dom'
import App  from './App'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.PROD_URL ? `https://{PROD_URL}/graphql` : 'http://localhost:3000/graphql'
})


const render = () => {
    ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root'));
}

if (module.hot) {
    module.hot.accept();
}
   
render()