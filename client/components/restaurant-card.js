import React, {useState} from 'react'

const restaurantCard = props => {
  const [showCard, setShow] = useState(false)
  return (
    <div>
      {!showCard ? (
        <button
          type="button"
          onClick={() => {
            setShow(true)
          }}
        >
          Reveal
        </button>
      ) : (
        <div>
          {props.price},{props.name}
        </div>
      )}
    </div>
  )
}

export default restaurantCard
