import React, {Component} from 'react'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from '@apollo/react-hooks'
import Restaurants from './restaurants'
const client = new ApolloClient({uri: 'http://localhost:8080/graphql'})
export default class Selection extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Restaurants />
      </ApolloProvider>
    )
  }
}
