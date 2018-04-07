import WebworkerPromise from 'webworker-promise'
import WorkerPool from 'webworker-promise/lib/pool'


const utilsWorker = WorkerPool.create({
  create: () => new Worker('utils.worker.js'),
  maxThreads: 3,
  maxConcurrentPerWorker: 1,
})

export const init = (payload, cb) => utilsWorker.postMessage(
  {
    type: 'init',
    payload,
  },
  [],
  cb
)

export const genChunk3 = (payload, cb) => utilsWorker.postMessage(
  {
    type: 'genChunk3',
    payload,
  },
  [],
  cb
)
