const User = require('../models/User')

// Get User // No Auth required
// @route GET /xgithub/:username/
exports.getUser = async (req, res) => {
  try {
    const user = await User.find({ username: req.params.username })
    if (user.length === 0)
      return res.status(404).json({ desc: 'User NOT found' })
    res.status(200).json({ des: 'User found', data: user })
  } catch (err) {
    res.status(404).json({ des: 'User NOT found', error: err })
  }
}

// Create new  User // Auth required
// @route POST /xgithub/new/
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ desc: 'User created', data: user })
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

// Update User // Auth required
// @route PUT /xgithub/:username/settings
exports.updateUser = async (req, res) => {
  try {
    // username should not be updated
    req.body.username = req.params.username
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true }
    )
    res.status(200).json({ desc: 'User updated', updates: updatedUser })
  } catch (err) {
    res.status(400).json({ desc: 'User updated failed', error: err })
  }
}

// Delete User // Auth required
// @route DELETE /xgithub/:username/settings
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username })
    if (!user) return res.status(404).json({ desc: 'User NOT found' })
    console.log(user)
    res.status(200).json({
      desc: 'User Deleted',
      data: `${req.params.username} account deleted`,
    })
  } catch (err) {
    res.status(400).json({
      desc: 'User Deletion failed',
      error: err,
    })
  }
}
