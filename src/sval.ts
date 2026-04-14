import Sval from 'sval'

export const sval = new Sval({
  ecmaVer: 'latest',
  sourceType: 'script',
  sandBox: true,
})

const sleep = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

sval.import({ sleep })
