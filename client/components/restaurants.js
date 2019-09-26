import React, {useState, useEffect} from 'react'
import {gql} from 'apollo-boost'
import {Query} from 'react-apollo'
import RestaurantCard from './restaurant-card'
import {useLazyQuery} from '@apollo/react-hooks'

import {Button, Form, Checkbox, Container, Card, Popup} from 'semantic-ui-react'
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
  while (randomInts.size < 9) {
    const random = Math.floor(Math.random() * array.length)
    randomInts.add(random)
  }
  randomInts.forEach((val, key) => cards.push(array[key]))
  return cards
}
const dollarSign = '$$$$'
const Restaurants = props => {
  const [cards, setCards] = useState(new Array(9).fill({}))
  const [cardId, setShow] = useState(false)
  const [getRestaurants, {loading, data}] = useLazyQuery(RESTAURANTS_QUERY)

  const [vars, setVars] = useState({
    radius: 4023.36,
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

    setPrices(copy)
  }

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
            label={`Radius: ${Math.ceil(2 * vars.radius * 0.00062137) / 2} mi`}
            min={804.672}
            max={8046.72}
            name="radius"
            onChange={e =>
              setVars({...vars, radius: Number(Math.ceil(e.target.value))})
            }
            step={804.672}
            type="range"
            value={vars.radius}
          />
          <Popup
            disabled={vars.latitude}
            content="Location not set"
            trigger={
              <Form.Button
                onClick={() =>
                  getRestaurants({
                    variables: {
                      ...vars,
                      price: prices.filter(price => price !== false).join()
                    }
                  })
                }
                disabled={Boolean(cards[0].id)}
              >
                Query
              </Form.Button>
            }
          />
          <Form.Button
            onClick={() =>
              navigator.geolocation.getCurrentPosition(getLocation)
            }
          >
            {' '}
            Get Location
          </Form.Button>
        </Form.Group>
      </Form>

      <Card.Group>
        {cards.map((business, idx) => (
          <RestaurantCard
            key={business.id ? business.id : idx}
            {...business}
            loading={loading}
            setShow={setShow}
            cardId={cardId}
          />
        ))}
      </Card.Group>
    </Container>
  )
}

export default Restaurants
