import React, {useState} from 'react'

const restaurantCard = props => {
  const [showCard, setShow] = useState(false)
  return !showCard ? (
    <div onClick={() => setShow(true)}>false</div>
  ) : (
    <div>{props.id}</div>
  )
}

export default restaurantCard
