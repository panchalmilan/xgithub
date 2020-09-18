const colors = require('colors')
const Repository = require('../models/Repository')

const extError = require('../utility/_extError')

// Get all Repositories  // No Auth required
// @route GET /xgithub/repos
exports.getRepositories = async (req, res) => {
  const repositories = await Repository.find()
  res.status(200).json({
    repositories,
  })
}

// Add new repository  // Auth required
exports.createRepository = async (req, res, next) => {
  req.body.username = req.params.username
  const test = await Repository.checkRepoUniqueness(
    req.body.name,
    req.params.username
  )
  if (test) {
    const repository = await Repository.create(req.body)
    res.status(201).json({
      desc: 'add new repo',
      auth: 'required',
      username: req.params.username,
      data: repository,
    })
  } else next(new extError('Repository cannot be same', 400, 'repository'))
}

// PENDING
// getSettingsPage

// Update repository  // Auth required
// @route UPDATE /:username/:repo/settings
exports.updateRepository = async (req, res, next) => {
  const uname = req.params.username
  const repo = req.params.repo
  req.body.name = repo // cannot change repository name

  const repositories = await Repository.find({ name: repo })
  if (repositories.length === 0)
    return next(new extError('No such repository found 1', 400, 'repository'))
  for (let i = 0; i < repositories.length; i++) {
    if (repositories[i].username === uname) {
      const newRepo = await Repository.findByIdAndUpdate(
        repositories[i]._id,
        req.body,
        { new: true }
      )
      return res.status(200).json({
        desc: 'Repository Updated',
        username: uname,
        repository: repo,
        updates: newRepo,
      })
    }
  }
  next(new extError('No such repository found 2', 400, 'repository'))
}

// Delete repository  // Auth required
// @route DELETE /:username/:repo/settings
exports.deleteRepository = async (req, res, next) => {
  const uname = req.params.username
  const repo = req.params.repo
  const repositories = await Repository.find({ name: repo })
  if (repositories.length === 0)
    return next(new extError('No such repository found 1', 400, 'repository'))
  for (let i = 0; i < repositories.length; i++) {
    if (repositories[i].username === uname) {
      await Repository.findByIdAndDelete(repositories[i]._id)
      return res.status(200).json({
        desc: 'Repository Deleted',
        username: uname,
        repository: repo,
      })
    }
  }
  next(new extError('No such repository found 1', 400, 'repository'))
}
