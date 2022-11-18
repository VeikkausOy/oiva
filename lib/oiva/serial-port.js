const { SerialPort } = require('serialport')
const { promisify } = require('util')
const { red, yellow } = require('../colors')

function openSerialPort(path) {
  return new Promise((resolve, reject) => {
    const serialPort = new SerialPort(
      {
        path,
        baudRate: 19200,
        dataBits: 8,
        parity: 'none',
        stopBits: 1
      },
      openError => {
        if (openError) {
          reject(openError)
        } else {
          resolve(extendSerialPortAPI(serialPort))
        }
      }
    )
  })
}

function extendSerialPortAPI(serialPort) {
  serialPort.writeAsync = promisify(serialPort.write)
  serialPort.drainAsync = promisify(serialPort.drain)
  return serialPort
}

/** Format given serial port data payload for presentation */
function dataPresentation(data) {
  return data.toString().replace('\r', '\\r').replace('\n', '\\n')
}

async function waitForLoopbackData(serialPort, expectedData) {
  return new Promise(resolve => {
    console.log('Waiting for sent data to be received via loopback interface…')

    let allReceivedData = ''
    const dataHandler = data => {
      console.log(`LOOPBACK RECEIVED: ${yellow(dataPresentation(data))}`)
      allReceivedData += data.toString()
      if (allReceivedData.length >= expectedData.length || allReceivedData.includes('\r\n')) {
        serialPort.removeListener('data', dataHandler)
        clearTimeout(timeoutId)
        resolve()
      }
    }

    const timeoutId = setTimeout(() => {
      console.error(red('Error: Waiting for loopback data timed out.'))
      serialPort.removeListener('data', dataHandler)
      resolve()
    }, 3000)

    serialPort.on('data', dataHandler)
  })
}

module.exports = {
  openSerialPort,
  waitForLoopbackData,
  dataPresentation
}
