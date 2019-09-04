import React, {Component} from 'react'
import {gql} from 'apollo-boost'
import {Query} from 'react-apollo'
import RestaurantCard from './restaurant-card'
const RESTAURANTS_QUERY = gql`
  query RestaurantsQuery {
    AllBusinesses {
      businesses {
        id
        price
      }
    }
  }
`
export default class Restaurants extends Component {
  render() {
    return (
      <div>
        <h1>
          <Query query={RESTAURANTS_QUERY}>
            {({loading, error, data}) => {
              if (loading) return <h2>loading</h2>
              if (error) console.log(error)
              console.log(data)
              return data.AllBusinesses.businesses.map(business => (
                <RestaurantCard {...business} />
              ))
            }}
          </Query>
        </h1>
      </div>
    )
  }
}
