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
          disabled={(props.cardId !== props.id && props.cardId) || !props.name}
        >
          <Card.Content> {props.loading ? 'loading' : '?'}</Card.Content>
        </Card>
      }
    >
      <Modal.Content>
        <Card.Content>
          <Card.Meta>Price: {props.price}</Card.Meta>
          {props.location ? (
            <Card.Description>
              Name: {props.name}
              {props.location.address1}
              {props.location.city},{props.location.state}{' '}
              {props.location.zip_code}
            </Card.Description>
          ) : (
            ''
          )}
        </Card.Content>
      </Modal.Content>
    </Modal>
  )
}

export default restaurantCard
