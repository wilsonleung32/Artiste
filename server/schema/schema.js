const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat
} = require('graphql')
const axios = require('axios')
const CategoriesType = new GraphQLObjectType({
  name: 'Categories',
  fields: () => ({
    title: {type: GraphQLString}
  })
})
const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    city: {type: GraphQLString},
    state: {type: GraphQLString},
    address1: {type: GraphQLString},
    zip_code: {type: GraphQLString}
  })
})
const RestaurantType = new GraphQLObjectType({
  name: 'Restaurant',
  fields: () => ({
    price: {type: GraphQLString},
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    categories: {type: new GraphQLList(CategoriesType)},
    location: {type: LocationType}
  })
})

const AllBusinessType = new GraphQLObjectType({
  name: 'Business',
  fields: () => ({
    businesses: {type: new GraphQLList(RestaurantType)}
  })
})

let url = 'https://api.yelp.com/v3/businesses/search?categories=restaurants'
const apiKey =
  '5GJE62_sw2xkLW9EQFAmb-BQcZkiH3IGubpNSvhlGJqSxNCQWT6XxkRVpm3Cez9UGulyjWqDqfqwkOPrEcWZ_7vcU220alWUU6OtPFZYvugVebrWacCeXfXbamZlXXYx'
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    AllBusinesses: {
      type: AllBusinessType,
      args: {
        price: {type: GraphQLString},
        radius: {type: GraphQLInt},
        latitude: {type: GraphQLFloat},
        longitude: {type: GraphQLFloat}
      },
      async resolve(parent, args) {
        let newUrl = url
        console.log(args)
        for (let key in args) {
          newUrl += `&${key}=${args[key]}`
        }

        console.log(newUrl)
        const {data} = await axios.get(newUrl, {
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
