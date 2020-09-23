const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.checkView = async (req, res, next) => {
  try {
    req.view = 'public'
    const token = req.header('auth-token')
    if (!token) {
      return next()
    }
    const username = req.params.username
    const { id: accessUserId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
    const userToBeAccessed = await User.findOne({ username })

    if (token && accessUserId === String(userToBeAccessed._id))
      req.view = 'private'
    next()
  } catch (err) {
    next()
  }
}
