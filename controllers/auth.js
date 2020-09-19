const User = require('../models/User')
const bcrypt = require('bcryptjs')

// Login User // Auth required
// @route POST /xgithub/:username/login
// @desc email && password  || username && password
exports.loginUser = async (req, res, next) => {
  // username, email flag
  let credential = false
  let user = {}

  // login via username
  if (req.body.username) {
    // checking if username exists
    const usernameExists = await User.findOne({ username: req.body.username })
    if (!usernameExists)
      return res
        .status(400)
        .json({ desc: 'Incorrect email or password // uname' })
    credential = true
    user = usernameExists
  }

  // login via email
  if (!credential && req.body.email) {
    // checking if email exists
    const emailExists = await User.findOne({ email: req.body.email })
    if (!emailExists)
      return res
        .status(400)
        .json({ desc: 'Incorrect email or password // email' })
    credential = true
    user = emailExists
  }

  // email or username not entered
  if (!credential) res.send(400).json({ desc: 'Enter email or username' })

  // validating password
  const isValidPassword = await bcrypt.compare(req.body.password, user.password)

  if (!isValidPassword)
    return res
      .status(400)
      .json({ desc: 'Incorrect email or password // password' })

  sendTokenResponse(user, res)
}

// generates token and send response
const sendTokenResponse = (user, res) => {
  const token = user.createAndSendJWT()
  res.header('auth-token', token).json({ desc: 'Logged In', data: user, token })
}
