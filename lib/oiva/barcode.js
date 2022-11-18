const { gameType } = require('./definitions')
const JsBarcode = require('jsbarcode')
let path = require('path')
const { createCanvas } = require('canvas')
const fs = require('fs')

function sectionToPaddedDecString(hex, start, end, length) {
  return parseInt(hex.slice(start, end), 16).toString().padStart(length, '0')
}

function itfChecksum(payload) {
  const modulo =
    payload.split('').reduce((acc, value, index) => {
      const multiplier = index % 2 === 0 ? 3 : 1
      return acc + parseInt(value, 10) * multiplier
    }, 0) % 10
  return modulo === 0 ? 0 : 10 - modulo
}

function totoTicketSerialToITF(ticketSerial) {
  const withoutDashes = ticketSerial.replace(/[^0-9a-f]/gi, '')
  const payload =
    sectionToPaddedDecString(withoutDashes, 0, 1, 2) +
    sectionToPaddedDecString(withoutDashes, 1, 5, 5) +
    sectionToPaddedDecString(withoutDashes, 5, 9, 5) +
    sectionToPaddedDecString(withoutDashes, 9, 13, 5)
  return `${payload}${itfChecksum(payload).toString()}`
}

function drawGameTicketSerialToITF(ticketSerial) {
  return ticketSerial
    .trim()
    .replace(/[^0-9]/g, '')
    .padStart(20, '0')
}

function ticketSerialToBarcodeData(ticketSerial, typeOfGame) {
  switch (typeOfGame) {
    case gameType.Toto:
      return totoTicketSerialToITF(ticketSerial)
    case gameType.Lotto:
    case gameType.KaikkiTaiEiMitaan:
      return drawGameTicketSerialToITF(ticketSerial)
  }
}

function createBarcodeImage(barcodeData, ticketSerial, gameType) {
  const canvas = createCanvas(513, 70)
  JsBarcode(canvas, barcodeData, {
    format: gameType === gameType.Toto ? 'CODE128' : 'ITF',
    height: 70,
    width: 3,
    displayValue: true,
    margin: 50,
    text: `${barcodeData}\n${ticketSerial ? ticketSerial : ''}`
  })

  try {
    const filePath = path.resolve(`${Date.now()}-${ticketSerial ? ticketSerial : barcodeData}.png`)
    fs.writeFileSync(filePath, canvas.toBuffer())
    console.log(`Barcode image file created: ${filePath}`)
  } catch (error) {
    console.error('Error: Failed to create barcode image file', error)
  }
}

module.exports = { createBarcodeImage, ticketSerialToBarcodeData }
