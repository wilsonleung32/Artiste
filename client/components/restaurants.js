import React, {useState, useEffect} from 'react'
import {gql} from 'apollo-boost'
import {Query} from 'react-apollo'
import RestaurantCard from './restaurant-card'
import {useLazyQuery} from '@apollo/react-hooks'

import {Button, Form, Checkbox, Container} from 'semantic-ui-react'
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
        location {
          city
          state
          address1
        }
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
const dollarSign = '$$$$'
const Restaurants = props => {
  const [cards, setCards] = useState([])
  const [cardId, setShow] = useState(false)
  const [getRestaurants, {loading, data}] = useLazyQuery(RESTAURANTS_QUERY)

  const [vars, setVars] = useState({
    radius: 3000,
    longitude: 40.7678,
    latitude: 73.9645
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
      console.log('here')
      navigator.geolocation.getCurrentPosition(getLocation)
    }
  }, [])
  useEffect(
    () => {
      if (data) {
        let arr = getRandom(data.AllBusinesses.businesses)
        setCards([...arr])
      }
    },
    [data]
  )
  const [prices, setPrices] = useState([1, 2, 3, 4])

  const handleChange = price => {
    const copy = [...prices]
    if (prices[price]) {
      copy[price] = false
    } else {
      copy[price] = price + 1
    }
    console.log(prices)
    setPrices(copy)
  }

  if (loading) return <h2>loading</h2>

  return (
    <Container>
      <Form>
        <Form.Group>
          {prices.map((price, idx) => (
            <Checkbox
              key={idx}
              label={dollarSign.slice(0, idx + 1)}
              checked={Boolean(price)}
              onChange={() => handleChange(idx)}
            />
          ))}
          <Form.Input
            label={`Radius: ${vars.radius}m`}
            min={1000}
            max={5000}
            name="radius"
            onChange={e => setVars({...vars, radius: Number(e.target.value)})}
            step={100}
            type="range"
            value={vars.radius}
          />
          <Form.Button
            onClick={() =>
              getRestaurants({
                variables: {
                  ...vars,
                  price: prices.filter(price => price !== false).join()
                }
              })
            }
            disabled={Boolean(cards.length)}
          >
            Query
          </Form.Button>
        </Form.Group>
      </Form>
      {cards.map(business => (
        <RestaurantCard
          key={business.id}
          {...business}
          setShow={setShow}
          cardId={cardId}
        />
      ))}
    </Container>
  )
}

export default Restaurants
