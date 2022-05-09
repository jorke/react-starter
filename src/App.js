import React from 'react'
import GraphQLComponent from './GraphQLComponent'
import './App.css'
import Map from './Map'

// named component needed to not break HMR
const App = props => <Map />

export default App
