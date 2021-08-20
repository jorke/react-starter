import React from 'react'
import { ChakraProvider } from "@chakra-ui/react"
import { Center } from '@chakra-ui/react'
import GraphQLComponent from './GraphQLComponent'

export default props => 
  <ChakraProvider>
      <Center height="100px">
        Hello <GraphQLComponent />!
      </Center>
  </ChakraProvider>


