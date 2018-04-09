import WebworkerPromise from 'webworker-promise'

import UtilsWorker from './utils.worker'


const workers = [new WebworkerPromise(new UtilsWorker())]

// import WorkerPool from 'webworker-promise/lib/pool'
//
//
// const utilsWorker = WorkerPool.create({
//   create: () => new Worker('utils.worker.js'),
//   maxThreads: 3,
//   maxConcurrentPerWorker: 1,
// })

let index = 0
const getActiveWorker = () => {
  return workers[index]

  if (index >= workers.length - 1) {
    index = 0
  }
  else {
    index += 1
  }
}

export const init = async (payload, cb) => {
  for (let i = 0; i < workers.length; i++) {
    await workers[i].postMessage(
      {
        type: 'init',
        payload,
      },
      [],
      cb
    )
  }
}

export const genChunk3 = (payload, cb) => getActiveWorker().postMessage(
  {
    type: 'genChunk3',
    payload,
  },
  [],
  cb
)
