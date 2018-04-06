import WebworkerPromise from 'webworker-promise'
import { mapObject } from '@packages/utils'


const utilsWorker = new WebworkerPromise(new Worker('utils.worker.js'))

export const init = (payload) => utilsWorker.postMessage({
  type: 'init',
  payload,
})

export const genChunk3 = (payload) => utilsWorker.postMessage({
  type: 'genChunk3',
  payload,
})
