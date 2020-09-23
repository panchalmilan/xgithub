const colors = require('colors')
const Repository = require('../models/Repository')
const User = require('../models/User')

const extError = require('../utility/_extError')

// Get all Repositories  // Auth required
// @route GET /xgithub/:username/repos
exports.getAllRepositories = async (req, res) => {
  let repositories
  console.log(req.view)
  if (req.view === 'private') repositories = await Repository.find()
  else repositories = await Repository.find({ accessBy: 'public' })
  res.status(200).json({
    repositories,
  })
}

// Add new repository  // Auth required
// @route POST xgithub/:username/new
exports.createRepository = async (req, res, next) => {
  const user = await User.findOne({
    username: req.params.username,
  })

  if (!user)
    return next(
      new extError(`user: ${req.params.username} not found `, 404, 'user')
    )

  if (req.accessUserId !== String(user._id))
    return next(
      new extError(
        `You are not authorized to create repo from this acct `,
        401,
        'repository'
      )
    )

  const isUnique = await Repository.checkRepoUniqueness(
    req.body.name,
    user.username
  )

  if (isUnique) {
    const repository = Repository(req.body)
    repository.userId = user._id
    repository.username = user.username
    repository.contributors.push(user.username)
    await repository.save()

    const isPrivate = req.body.accessBy === 'private' ? true : false
    if (!isPrivate) {
      // public
      user.publicRepositories.push(repository)
      user.noOfPublicRepositories++
    }
    // private
    user.repositories.push(repository)
    user.noOfRepositories++
    await user.save()

    res.status(201).json({
      data: repository,
      desc: 'add new repo',
      auth: 'required',
      username: req.params.username,
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
