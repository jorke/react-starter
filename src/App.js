import React from 'react'
import GraphQLComponent from './GraphQLComponent'
import './App.css'

// named component needed to not break HMR
const App = props => 
  <div className='App-Root'>
    <h1>
      Hello <GraphQLComponent />
    </h1>
  </div>

export default App
