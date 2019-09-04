const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt
} = require('graphql')
const axios = require('axios')
const RestaurantType = new GraphQLObjectType({
  name: 'Restaurant',
  fields: () => ({
    price: {type: GraphQLString},
    id: {type: GraphQLString},
    name: {type: GraphQLString}
  })
})

const AllBusinessType = new GraphQLObjectType({
  name: 'Business',
  fields: () => ({
    businesses: {type: new GraphQLList(RestaurantType)}
  })
})

const url = 'https://api.yelp.com/v3/businesses/search?location=NYC&limit=3'
const apiKey =
  '5GJE62_sw2xkLW9EQFAmb-BQcZkiH3IGubpNSvhlGJqSxNCQWT6XxkRVpm3Cez9UGulyjWqDqfqwkOPrEcWZ_7vcU220alWUU6OtPFZYvugVebrWacCeXfXbamZlXXYx'
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    AllBusinesses: {
      type: AllBusinessType,
      async resolve(parent, args) {
        const {data} = await axios.get(url, {
          headers: {Authorization: `Bearer ${apiKey}`}
        })

        return data
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})