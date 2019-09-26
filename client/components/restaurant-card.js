import React, {useState} from 'react'
import {Card, Button, Modal} from 'semantic-ui-react'
const restaurantCard = props => {
  return (
    <Modal
      trigger={
        <Card
          as={Button}
          onClick={() => {
            props.setShow(props.id)
          }}
          disabled={props.cardId !== props.id && props.cardId}
        >
          <Card.Content>?</Card.Content>
        </Card>
      }
    >
      <Modal.Content>
        <Card.Content>
          <Card.Meta>Price: {props.price}</Card.Meta>
          <Card.Description>Name: {props.name}</Card.Description>
        </Card.Content>
      </Modal.Content>
    </Modal>
  )
}

export default restaurantCard
