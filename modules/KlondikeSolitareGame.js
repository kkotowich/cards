'use strict'

import Deck, { FAN_DIRECTIONS } from "./Deck.js";

const GAME_STATES = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: 'in_progress',
  WIN: 'win',
  LOSE: 'lose'
}

class KlondikeSolitareGame {
  constructor() {
    this.state = GAME_STATES.NOT_STARTED
    this.displayElement = document.querySelector('.gameboard')

    this.selectedCard = null

    // shadows used for quick lookup of targets
    this.shadowCards = []
    this.shadowDecks = []

    this.stockDeck = new Deck(0, 'stock', document.querySelector('.stock .draw'))
    this.wasteDeck = new Deck(1, 'waste', document.querySelector('.stock .waste'))
    this.foundationDecks = []
    this.tableauDecks = []

    for (let i = 0; i < 4; i++) {
      this.foundationDecks.push(new Deck(i + 2, 'foundation', document.querySelector(`.foundation${i + 1}`)))
    }

    for (let i = 0; i < 7; i++) {
      this.tableauDecks.push(new Deck(i + 6, 'tableau', document.querySelector(`.tableau${i + 1}`), FAN_DIRECTIONS.DOWN))
    }
  }

  init() {
    this.state = GAME_STATES.IN_PROGRESS

    this.addEventListeners()

    this.stockDeck.init52CardDeck()
    this.stockDeck.shuffle()

    /**
     * card.id is set after shuffling the deck to ensure each card has a different id each game
     * this allows the game to identify face down cards, while making it slightly more difficult for the user to peek
    */
    this.stockDeck.cards.forEach((card, index) => {
      card.id = index
      card.updateDisplay()
    })

    // shadows are references, not copies
    this.shadowDecks = [this.stockDeck, this.wasteDeck, ...this.foundationDecks, ...this.tableauDecks]
    this.shadowCards = [...this.stockDeck.cards]

    this.dealTableau()

    this.updateDisplay()
  }

  addEventListeners() {
    // TODO: move to Card class?
    this.displayElement.addEventListener('click', (e) => { this.handleCardClick(e) })

    this.stockDeck.displayElement.addEventListener('click', (e) => { this.handleDrawClick(e) })

    // TODO: how to do this without the temp variable?  ([this.wasteDeck, ...this.foundationDecks, ...this.tableauDecks]]).eachEach()?
    var clickableDecks = [this.wasteDeck, ...this.foundationDecks, ...this.tableauDecks]
    clickableDecks.forEach(deck => {
      deck.displayElement.addEventListener('click', (e) => { this.handleEmptyDeckClick(e, deck.id) })
    });
  }

  dealTableau() {
    var count = 0
    for (let i = 0; i < this.tableauDecks.length; i++) {
      for (let j = count; j < this.tableauDecks.length; j++) {
        this.stockDeck.dealCard(this.tableauDecks[j], false)
      }
      this.tableauDecks[count].flipTopCard();
      count++
    }
  }

  updateDisplay() {
    var stockDeckEl = document.querySelector('.stock .draw')
    var stockDeckCountEl = stockDeckEl.querySelector('.description > .count')
    stockDeckCountEl.innerText = `${this.stockDeck.cards.length}`

    this.wasteDeck.updateDisplay()

    for (let i = 0; i < this.foundationDecks.length; i++) {
      this.foundationDecks[i].updateDisplay()
    }

    for (let i = 0; i < this.tableauDecks.length; i++) {
      this.tableauDecks[i].updateDisplay()
    }
  }

  handleDrawClick(e) {
    e.stopPropagation() // prevent deck, card clicked events

    this.unselectAllCards()

    if (this.stockDeck.cards.length == 0) {
      for (let i = this.wasteDeck.cards.length; i > 0; i--) {
        var card = this.wasteDeck.cards.pop()
        card.flipCard()
        this.stockDeck.cards.push(card)
      }
    } else {
      this.stockDeck.dealCard(this.wasteDeck)
    }

    this.updateDisplay()
  }

  handleEmptyDeckClick(e, deckId) {
    var clickedDeck = this.shadowDecks[deckId]
    if (clickedDeck.cards.length) {
      return
    }

    e.stopPropagation() // prevent card clicked event

    if (this.selectedCard == null) {
      // selecting a source card, can't select an empty deck
      return
    } else {
      // selecting a destination card
      var isValidMove = this.validateMove(clickedDeck, this.selectedCard)
      if (!isValidMove) {
        return
      }

      var sourceDeck = this.shadowDecks[this.selectedCard.deckId]
      var selectedCardIndex = sourceDeck.findCardIndex(this.selectedCard)
      sourceDeck.moveCards(clickedDeck, selectedCardIndex)

      this.unselectAllCards()
    }

    this.updateDisplay()
  }

  handleCardClick(e) {
    var cardId = e.target.getAttribute('card-id')

    if (!cardId) {
      // target is not a card
      return
    }

    var clickedCard = this.shadowCards[cardId]

    if (this.selectedCard == null) {
      this.handleSourceCardClick(clickedCard)
    } else {
      this.handleDestinationCardClick(clickedCard)
    }
    this.updateDisplay()
  }

  validateMove(targetDeck, selectedCard, destinationCard = null) {
    if (destinationCard && destinationCard.id == selectedCard.id) {
      return true
    }

    if (targetDeck.cards.length == 0) {
      return this.validateMoveToEmptyDeck(targetDeck, selectedCard)
    } else {
      var destinationCard = targetDeck.getTopCard()

      switch (targetDeck.type) {
        case 'foundation':

          var sourceDeck = this.shadowDecks[selectedCard.deckId]
          if (sourceDeck.getTopCard().id != selectedCard.id) {
            // can only move 1 card at a time to foundation
            return false
          }

          if (!(selectedCard.value - destinationCard.value == 1 && selectedCard.suite == destinationCard.suite)) {
            return false
          }
          break

        case 'tableau':
          if (!(destinationCard.value - selectedCard.value == 1)) {
            return false
          } else {
            if (!this.validateAlternatingSuites(destinationCard.suite,selectedCard.suite)) {
              return false
            }
          }
          break

        case 'waste':
        default:
          return false
      }

      return true
    }
  }

  validateAlternatingSuites(suite1, suite2) {
    return (
      (
        ['hearts', 'diamonds'].includes(suite1)
        && ['spades', 'clubs'].includes(suite2)
      ) ||
      (
        ['spades', 'clubs'].includes(suite1)
        && ['hearts', 'diamonds'].includes(suite2)
      )
    )
  }

  validateMoveToEmptyDeck(targetDeck, selectedCard) {
    switch (targetDeck.type) {
      case 'foundation':
        //only ace can start a new foundation
        if (selectedCard.value != '1') { // 1 = ace
          return false
        }
        break

      case 'tableau':
        //only king can start a new tableau
        if (selectedCard.value != '13') { // 13 = king
          return false
        }
        break

      case 'waste':
      default:
        return false
    }
    return true
  }

  handleSourceCardClick(sourceCard) {
    var sourceDeck = this.shadowDecks[sourceCard.deckId]
    if (sourceDeck.type == 'foundation') {
      return
    }

    if (!sourceCard.isFaceUp) {
      if (sourceDeck.getTopCard().id == sourceCard.id) {
        sourceCard.flipCard()
      }
      return
    }

    this.selectedCard = sourceCard

    // select clicked card and all cards on top of it
    var selectedCardIndex = sourceDeck.findCardIndex(this.selectedCard)
    for (let i = selectedCardIndex; i < sourceDeck.cards.length; i++) {
      sourceDeck.cards[i].selectCard()
    }
  }

  handleDestinationCardClick(destinationCard) {
    var sourceDeck = this.shadowDecks[this.selectedCard.deckId]
    var destinationDeck = this.shadowDecks[destinationCard.deckId]

    if (destinationDeck.type == 'waste') {
      // TODO: select waste?
      this.unselectAllCards()
      return
    }

    var isValidMove = this.validateMove(destinationDeck, this.selectedCard, destinationCard)
    if (!isValidMove) {
      return
    }

    var selectedCardIndex = sourceDeck.findCardIndex(this.selectedCard)
    sourceDeck.moveCards(destinationDeck, selectedCardIndex)

    this.unselectAllCards()

    if (this.validateWin()) {
      console.log("win!")
    } else {
      console.log("not win!")
    }
  }

  validateWin() {
    var cardCount = 0
    this.foundationDecks.forEach(deck => {
      cardCount += deck.cards.length
    })

    return cardCount == this.shadowCards.length
  }

  unselectAllCards() {
    this.shadowCards.forEach(card => {
      card.unselectCard()
    })
    this.selectedCard = null
  }
}

export default KlondikeSolitareGame