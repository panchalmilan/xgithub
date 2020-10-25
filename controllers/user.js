const User = require('../models/User')
const bcrypt = require('bcryptjs')
const Repository = require('../models/Repository')

const extError = require('../utility/_extError')

// Get User // No Auth required
// @route GET /xgithub/:username/
exports.getUser = async (req, res, next) => {
  const user = req.user

  // current user(based on token) wants someone else (based on params) info
  const includesArr = [
    'bio',
    'starred',
    'noOfPublicRepositories',
    'name',
    'username',
  ]
  const publicViewUser = {}
  includesArr.forEach((prop) => (publicViewUser[prop] = user[prop]))
  res
    .status(200)
    .json({ message: 'User found', view: 'PUBLIC', data: publicViewUser })
}

// Create new  User
// @route POST /xgithub/new/
exports.createUser = async (req, res, next) => {
  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  req.body.password = hashedPassword
  // Create User
  const user = await User.create(req.body)
  // Create Token
  const token = user.createAndSendJWT()
  res
    .status(201)
    .header('auth-token', token)
    .json({ token, desc: 'User created', data: user })
}

// Update User // Auth required
// @route PUT /xgithub/:username/settings
exports.updateUser = async (req, res, next) => {
  const user = req.user

  // cannot change username
  req.body.username = req.params.username
  const updatedUser = await User.findOneAndUpdate(
    { username: req.params.username },
    req.body,
    { new: true }
  )
  res.status(200).json({ desc: 'User updated', updates: updatedUser })
}

// Delete User // Auth required
// @route DELETE /xgithub/:username/settings
exports.deleteUser = async (req, res, next) => {
  const user = req.user

  // deleting users all repos
  const repositories = user.repositories
  repositories.forEach(
    async (repoId) => await Repository.findByIdAndDelete(repoId)
  )

  // deleting user
  await User.findByIdAndDelete(user._id)

  res.status(200).json({
    desc: 'User Deleted',
    message: `${req.params.username} account deleted`,
  })
}
