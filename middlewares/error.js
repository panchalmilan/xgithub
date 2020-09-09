const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    err.message = `${err.keyValue.username} already exists!`
  }

  if (err.code === 404) {
    if (err.entity === 'user') {
      // No changes
      // err.message = err.message
    }
    if (err.entity === 'repository') {
      // No changes
      // err.message = err.message
    }
  }

  // console.log(`Error: ${err.message}`.red.bold)
  res.status(400).json({
    errorMessage: err.message || err,
    code: err.code || 500,
  })
}

module.exports = errorHandler
