const colors = require('colors')
const Repository = require('../models/Repository')

// Get all Repositories  // No Auth required
// @route GET /xgithub/repos
exports.getRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find()
    res.status(200).json({
      repositories,
    })
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

// Add new repository  // Auth required
exports.createRepository = async (req, res) => {
  try {
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
    } else {
      res.status(400).json({ error: 'Repository name cant be same' })
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

// PENDING
// getSettingsPage

// Update repository  // Auth required
// @route UPDATE /:username/:repo/settings
exports.updateRepository = async (req, res) => {
  try {
    const uname = req.params.username
    const repo = req.params.repo
    req.body.name = repo // cannot change repository name

    const repositories = await Repository.find({ name: repo })
    if (repositories.length === 0)
      return res.status(400).json('No such repository found 1')
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
    res.status(400).json('No such repository found 2')
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

// Delete repository  // Auth required
// @route DELETE /:username/:repo/settings
exports.deleteRepository = async (req, res) => {
  try {
    const uname = req.params.username
    const repo = req.params.repo
    const repositories = await Repository.find({ name: repo })
    if (repositories.length === 0)
      return res.status(400).json('No such repository found 1')
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
    res.status(400).json('No such repository found 2')
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
