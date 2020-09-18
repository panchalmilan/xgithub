const User = require('../models/User')
const bcrypt = require('bcryptjs')

const extError = require('../utility/_extError')

// Get User // No Auth required
// @route GET /xgithub/:username/
exports.getUser = async (req, res, next) => {
  const user = await User.find({ username: req.params.username })
  if (user.length === 0)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )
  res.status(200).json({ message: 'User found', data: user })
}

// Create new  User
// @route POST /xgithub/new/
exports.createUser = async (req, res) => {
  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  req.body.password = hashedPassword

  // Create User
  const user = await User.create(req.body)
  res.status(201).json({ desc: 'User created', data: user })
}

// Update User // Auth required
// @route PUT /xgithub/:username/settings
exports.updateUser = async (req, res, next) => {
  // cannot change username
  req.body.username = req.params.username
  const updatedUser = await User.findOneAndUpdate(
    { username: req.params.username },
    req.body,
    { new: true }
  )
  if (!updatedUser)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )
  res.status(200).json({ desc: 'User updated', updates: updatedUser })
}

// Delete User // Auth required
// @route DELETE /xgithub/:username/settings
exports.deleteUser = async (req, res, next) => {
  const user = await User.findOneAndDelete({ username: req.params.username })
  if (!user)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )
  res.status(200).json({
    desc: 'User Deleted',
    message: `${req.params.username} account deleted`,
  })
}

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

  res.json({ desc: 'Logged In', data: user })
}
