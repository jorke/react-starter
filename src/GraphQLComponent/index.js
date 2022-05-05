import React from 'react'
import { gql, useQuery } from '@apollo/client'

export default props => {
  const { loading, error, data } = useQuery(
    gql`
      query HelloQuery {
        hello
      }

    `
  )
  if (loading) return 'loading..'
  
  return <>{data.hello}!</>
}