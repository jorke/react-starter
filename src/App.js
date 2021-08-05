import React from 'react'
import { ChakraProvider, Container, Text } from "@chakra-ui/react"

export default props => 
  <ChakraProvider>
    <Container>
      <Text fontSize="6xl">Hello World!</Text>
    </Container>
  </ChakraProvider>
  