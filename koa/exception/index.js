class ExceptionError extends Error {
  constructor(code, msg) {
    super(msg)
    this.code = code || 'ExceptionError'
    this.msg = msg || ''
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

module.exports = {
  error: function(code, msg) {
    return new ExceptionError(code, msg)
  }
}
