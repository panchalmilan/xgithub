const jwt = require('jsonwebtoken')
const extError = require('../utility/_extError')
const asyncHandler = require('express-async-handler')

exports.authToken = asyncHandler((req, res, next) => {
  const token = req.header('auth-token')

  // user has no token
  if (!token) return next(new extError('Access Denied', 401, 'user'))

  const { id: accessUserId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
  req.accessUserId = accessUserId
  next()
})
