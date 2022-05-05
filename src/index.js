import React from 'react'
import { createRoot } from 'react-dom/client'
import App  from './App'
import './index.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.PROD_URL ? `https://{PROD_URL}/graphql` : 'http://localhost:3000/graphql'
})

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>)