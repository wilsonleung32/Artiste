import React, {useState, useEffect} from 'react'
import {gql} from 'apollo-boost'
import {Query} from 'react-apollo'
import RestaurantCard from './restaurant-card'
import {useLazyQuery} from '@apollo/react-hooks'

const RESTAURANTS_QUERY = gql`
  query RestaurantsQuery(
    $price: String
    $radius: Int
    $latitude: Float
    $longitude: Float
  ) {
    AllBusinesses(
      price: $price
      radius: $radius
      latitude: $latitude
      longitude: $longitude
    ) {
      businesses {
        id
        name
        price
      }
    }
  }
`
const getRandom = array => {
  const cards = []
  const randomInts = new Set()
  while (randomInts.size < 10) {
    const random = Math.floor(Math.random() * array.length)
    randomInts.add(random)
  }
  randomInts.forEach((val, key) => cards.push(array[key]))
  return cards
}

const Restaurants = props => {
  const [getRestaurants, {loading, data}] = useLazyQuery(RESTAURANTS_QUERY)

  const [vars, setVars] = useState({
    radius: 3000,
    longitude: null,
    latitude: null
  })
  const getLocation = position => {
    setVars({
      ...vars,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getLocation)
    }
  }, [])
  const [prices, setPrices] = useState([1, 2, 3, 4])

  const handleChange = price => {
    const copy = [...prices]
    if (prices[price]) {
      copy[price] = false
    } else {
      copy[price] = price + 1
    }

    setPrices(copy)
  }
  let arr = []
  if (loading) return <h2>loading</h2>
  // if (error) console.log(error)
  if (data) arr = getRandom(data.AllBusinesses.businesses)
  console.log(vars.latitude)
  return (
    <div>
      <div>
        <input
          type="checkbox"
          name="$"
          checked={prices[0]}
          onChange={() => handleChange(0)}
        />
        <label htmlFor="$">$</label>
        <input
          type="checkbox"
          name="$$"
          checked={prices[1]}
          onChange={() => handleChange(1)}
        />

        <label htmlFor="$$">$$</label>
        <input
          type="checkbox"
          name="$$$"
          checked={prices[2]}
          onChange={() => handleChange(2)}
        />
        <label htmlFor="$$$">$$$</label>
        <input
          name="radius"
          type="range"
          min="1000"
          max="5000"
          value={vars.radius}
          onChange={e => setVars({...vars, radius: Number(e.target.value)})}
        />
        <label htmlFor="radius">Max Distance: {vars.radius}</label>
      </div>
      {!data ? (
        <button
          type="button"
          onClick={() =>
            getRestaurants({
              variables: {
                ...vars,
                price: prices.filter(price => price !== false).join()
              }
            })
          }
        >
          Click
        </button>
      ) : (
        arr.map(business => <RestaurantCard key={business.id} {...business} />)
      )}
    </div>
  )
}

export default Restaurants
