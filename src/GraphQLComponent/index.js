import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Spinner } from '@chakra-ui/react'

export default props => {
  const { loading, error, data } = useQuery(
    gql`
      query HelloQuery {
        hello
      }

    `
  )
  if (loading) return <Spinner />
  
  return <>{data.hello}</>
}