class extError extends Error {
  constructor(message, code, entity) {
    super(message)
    this.code = code
    this.entity = entity
  }
}

module.exports = extError
