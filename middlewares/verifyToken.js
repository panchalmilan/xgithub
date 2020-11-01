const jwt = require('jsonwebtoken')
const extError = require('../utility/_extError')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

exports.authToken = asyncHandler(async (req, res, next) => {
  const token = req.header('auth-token')

  // user has no token
  if (!token) return next(new extError('Access Denied', 400, 'user'))

  const { id: accessUserId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
  req.accessUserId = accessUserId

  await userExistence(req, res, next)
})

const userExistence = asyncHandler(async (req, res, next) => {
  /**
   * req.path
   *   /<username>          GET
   *   /<username>/settings UPDATE
   *   /<username>/settings DELETE
   */
  const user = await User.findOne({ username: req.params.username })
  // user not found
  if (!user)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )
  req.user = user
  userAccess(req, res, next)
})

const userAccess = asyncHandler((req, res, next) => {
  const user = req.user
  if (req.method === 'GET' && req.accessUserId === String(user._id)) {
    // current user(based on token) wants his(based on params) info
    return res
      .status(200)
      .json({ message: 'User found', view: 'private', data: user })
  } else if (req.method === 'PUT' && req.accessUserId !== String(user._id)) {
    // current user(based on token) wants to update someone else(based on params) info
    return next(`You are not authorized to update other user info`, 401, 'user')
  } else if (req.method === 'DELETE' && req.accessUserId !== String(user._id)) {
    // current user(based on token) wants to delete someone else (based on params)acct
    return next(`You are not authorized to delete other user acct`, 401, 'user')
  } else next()
})
