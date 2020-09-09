const User = require('../models/User')

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

// Create new  User // Auth required
// @route POST /xgithub/new/
exports.createUser = async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).json({ desc: 'User created', data: user })
}

// Update User // Auth required
// @route PUT /xgithub/:username/settings
exports.updateUser = async (req, res, next) => {
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
