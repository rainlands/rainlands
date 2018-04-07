import WebworkerPromise from 'webworker-promise'


const workers = [
  new WebworkerPromise(new Worker('utils.worker.js')),
  new WebworkerPromise(new Worker('utils.worker.js')),
  new WebworkerPromise(new Worker('utils.worker.js')),
  new WebworkerPromise(new Worker('utils.worker.js')),
]

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

  if (index >= 3) {
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
