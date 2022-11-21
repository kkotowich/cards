'use strict'

import Card from './Card.js'
import { shuffle } from "../helpers/index.js"

export const FAN_DIRECTIONS = {
  NONE: 'none',
  UP: 'up',  // unused
  RIGHT: 'right', // unused
  DOWN: 'DOWN',
  LEFT: 'LEFT', // unused
}

class Deck {
  constructor(id, type, displayElement, fanDirection = FAN_DIRECTIONS.NONE) {
    this.id = id
    this.type = type
    this.displayElement = displayElement
    this.fanDirection = fanDirection
    this.cards = []
  }

  shuffle() {
    shuffle(this.cards)
  }

  // Deals a single card
  dealCard(target, isFaceUp = true) {
    if (!this.cards.length) {
      return false
    }

    var card = this.cards.pop()

    card.isFaceUp = isFaceUp
    card.deckId = target.id

    target.cards.push(card)

    return true
  }

  // Moves cards to new deck and retains card order 
  moveCards(target, startIndex, endIndex = this.cards.length) {
    if (
      startIndex > endIndex
      || !this.cards.length
    ) {
      return false
    }

    var moveSlice = this.cards.slice(startIndex)
    this.cards = this.cards.slice(0, startIndex)

    moveSlice.forEach(card => {
      card.isFaceUp = true
      card.deckId = target.id
    });

    target.cards = [...target.cards, ...moveSlice]

    return true
  }

  flipTopCard() {
    this.getTopCard().flipCard()
  }

  getTopCard() {
    return this.cards[this.cards.length - 1]
  }

  findCardIndex(target) {
    return this.cards.findIndex(card => {
      return card.id == target.id
    })
  }

  updateDisplay() {
    this.displayElement.replaceChildren();

    if (this.cards.length) {
      this.displayElement.classList.remove('card', 'empty')
      if (this.fanDirection == FAN_DIRECTIONS.NONE) {
        // display top card
        var topCard = this.getTopCard()
        topCard.updateDisplay()
        this.displayElement.appendChild(topCard.displayElement)
      } else {
        // display all cards in fan direction
        for (let i = 0; i < this.cards.length; i++) {
          var card = this.cards[i]
          card.updateDisplay()
          this.displayElement.appendChild(card.displayElement)
        }
      }
    } else {
      var cardEl = document.createElement('div')
      cardEl.classList.add('card', 'empty')

      this.displayElement.appendChild(cardEl)
      // this.displayElement.classList.add('card')
    }
  }

  init52CardDeck() {
    this.cards = []
    this.cards.push(new Card(null, this.id, '1', 'A', 'hearts'))
    this.cards.push(new Card(null, this.id, '2', '2', 'hearts'))
    this.cards.push(new Card(null, this.id, '3', '3', 'hearts'))
    this.cards.push(new Card(null, this.id, '4', '4', 'hearts'))
    this.cards.push(new Card(null, this.id, '5', '5', 'hearts'))
    this.cards.push(new Card(null, this.id, '6', '6', 'hearts'))
    this.cards.push(new Card(null, this.id, '7', '7', 'hearts'))
    this.cards.push(new Card(null, this.id, '8', '8', 'hearts'))
    this.cards.push(new Card(null, this.id, '9', '9', 'hearts'))
    this.cards.push(new Card(null, this.id, '10', '10', 'hearts'))
    this.cards.push(new Card(null, this.id, '11', 'J', 'hearts'))
    this.cards.push(new Card(null, this.id, '12', 'Q', 'hearts'))
    this.cards.push(new Card(null, this.id, '13', 'K', 'hearts'))

    this.cards.push(new Card(null, this.id, '1', 'A', 'clubs'))
    this.cards.push(new Card(null, this.id, '2', '2', 'clubs'))
    this.cards.push(new Card(null, this.id, '3', '3', 'clubs'))
    this.cards.push(new Card(null, this.id, '4', '4', 'clubs'))
    this.cards.push(new Card(null, this.id, '5', '5', 'clubs'))
    this.cards.push(new Card(null, this.id, '6', '6', 'clubs'))
    this.cards.push(new Card(null, this.id, '7', '7', 'clubs'))
    this.cards.push(new Card(null, this.id, '8', '8', 'clubs'))
    this.cards.push(new Card(null, this.id, '9', '9', 'clubs'))
    this.cards.push(new Card(null, this.id, '10', '10', 'clubs'))
    this.cards.push(new Card(null, this.id, '11', 'J', 'clubs'))
    this.cards.push(new Card(null, this.id, '12', 'Q', 'clubs'))
    this.cards.push(new Card(null, this.id, '13', 'K', 'clubs'))

    this.cards.push(new Card(null, this.id, '1', 'A', 'spades'))
    this.cards.push(new Card(null, this.id, '2', '2', 'spades'))
    this.cards.push(new Card(null, this.id, '3', '3', 'spades'))
    this.cards.push(new Card(null, this.id, '4', '4', 'spades'))
    this.cards.push(new Card(null, this.id, '5', '5', 'spades'))
    this.cards.push(new Card(null, this.id, '6', '6', 'spades'))
    this.cards.push(new Card(null, this.id, '7', '7', 'spades'))
    this.cards.push(new Card(null, this.id, '8', '8', 'spades'))
    this.cards.push(new Card(null, this.id, '9', '9', 'spades'))
    this.cards.push(new Card(null, this.id, '10', '10', 'spades'))
    this.cards.push(new Card(null, this.id, '11', 'J', 'spades'))
    this.cards.push(new Card(null, this.id, '12', 'Q', 'spades'))
    this.cards.push(new Card(null, this.id, '13', 'K', 'spades'))

    this.cards.push(new Card(null, this.id, '1', 'A', 'diamonds'))
    this.cards.push(new Card(null, this.id, '2', '2', 'diamonds'))
    this.cards.push(new Card(null, this.id, '3', '3', 'diamonds'))
    this.cards.push(new Card(null, this.id, '4', '4', 'diamonds'))
    this.cards.push(new Card(null, this.id, '5', '5', 'diamonds'))
    this.cards.push(new Card(null, this.id, '6', '6', 'diamonds'))
    this.cards.push(new Card(null, this.id, '7', '7', 'diamonds'))
    this.cards.push(new Card(null, this.id, '8', '8', 'diamonds'))
    this.cards.push(new Card(null, this.id, '9', '9', 'diamonds'))
    this.cards.push(new Card(null, this.id, '10', '10', 'diamonds'))
    this.cards.push(new Card(null, this.id, '11', 'J', 'diamonds'))
    this.cards.push(new Card(null, this.id, '12', 'Q', 'diamonds'))
    this.cards.push(new Card(null, this.id, '13', 'K', 'diamonds'))
  }
}

export default Deck