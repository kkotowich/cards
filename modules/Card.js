'use strict'

class Card {
  constructor(id = "", deckId = "", value = 0, symbol = '', suite = null, isFaceUp = false, isSelected = false) {
    this.id = id
    this.deckId = deckId
    this.value = value
    this.symbol = symbol
    this.suite = suite
    this.isFaceUp = isFaceUp
    this.isSelected = isSelected
    this.displayElement = this.makeDisplayElement()

    this.updateDisplay()
  }

  makeDisplayElement() {
    var displayCardEl = document.createElement('div')

    displayCardEl.classList.add('card')

    displayCardEl.setAttribute('card-id', this.id)

    if (this.isFaceUp) {
      displayCardEl.classList.add(this.suite)
    } else {
      displayCardEl.classList.remove(this.suite)
    }

    var displayCardText = document.createElement('p')
    displayCardText.innerText = this.generateDisplayText()
    displayCardEl.appendChild(displayCardText)

    return displayCardEl
  }

  updateDisplay() {
    this.displayElement.setAttribute('card-id', this.id)

    var displayText = this.generateDisplayText()
    
    if (this.isFaceUp) {
      this.displayElement.classList.add(this.suite)
      this.displayElement.classList.remove('facedown')
    } else {
      this.displayElement.classList.add('facedown')
      this.displayElement.classList.remove(this.suite)
    }

    if (this.isSelected) {
      this.displayElement.classList.add('selected')
    } else {
      this.displayElement.classList.remove('selected')
    }

    var displayCardTextEl = this.displayElement.querySelector('p')

    displayCardTextEl.innerText = displayText
  }

  generateDisplayText() {
    if (this.isFaceUp) {
      return this.suite ? `${this.symbol} - ${this.suite}` : this.symbol
    } else {
      return 'FACE DOWN'
    }
  }

  flipCard() {
    this.isFaceUp = !this.isFaceUp
    this.updateDisplay()
  }

  selectCard() {
    this.isSelected = true
    this.updateDisplay()
  }

  unselectCard() {
    this.isSelected = false
    this.updateDisplay()
  }
}

export default Card