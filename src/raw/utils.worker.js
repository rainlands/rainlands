// worker.js
const registerWebworker = require('webworker-promise/lib/register')
const Noise = require('noisejs')


registerWebworker(async (message, emit) => {
  console.log(message)
  // message - ping
  return 'pong'
})
