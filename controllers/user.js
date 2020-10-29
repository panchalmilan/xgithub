const User = require('../models/User')
const bcrypt = require('bcryptjs')
const Repository = require('../models/Repository')
const extError = require('../utility/_extError')

// Get User // No Auth required
// @route GET /xgithub/:username/
exports.getUser = async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username })

  if (!user)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )

  if (req.accessUserId === String(user._id))
    // current user(based on token) wants his(based on params) info
    return res
      .status(200)
      .json({ message: 'User found', view: 'private', data: user })

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
  const user = await User.findOne({ username: req.params.username })

  // user not found
  if (!user)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )

  if (req.accessUserId !== String(user._id))
    // current user(based on token) wants to update someone else(based on params) info
    return next(`You are not authorized to update other user info`, 401, 'user')

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
  const user = await User.findOne({ username: req.params.username })

  // user not found
  if (!user)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )

  if (req.accessUserId !== String(user._id))
    // current user(based on token) wants to delete someone else (based on params)acct
    return next(`You are not authorized to delete other user acct`, 401, 'user')

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
