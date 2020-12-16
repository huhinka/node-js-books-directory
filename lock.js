class Lock {
  constructor () {
    this._locked = false
    this._waiting = []
  }

  lock () {
    const unlock = () => {
      let nextResolve
      if (this._waiting.length > 0) {
        nextResolve = this._waiting.pop(0)
        nextResolve(unlock)
      } else {
        this._locked = false
      }
    }
    if (this._locked) {
      return new Promise((resolve) => {
        this._waiting.push(resolve)
      })
    } else {
      this._locked = true
      return new Promise((resolve) => {
        resolve(unlock)
      })
    }
  }
}

module.exports = Lock
