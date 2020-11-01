const colors = require('colors')
const { Router } = require('express')
const Repository = require('../models/Repository')
const User = require('../models/User')

const extError = require('../utility/_extError')

// Get all Repositories  // Auth required
// @route GET /xgithub/:username/repos
exports.getAllRepositories = async (req, res) => {
  let repositories
  if (req.view === 'private')
    repositories = await Repository.find().populate('userId')
  else
    repositories = await Repository.find({ accessBy: 'public' }).populate(
      'userId',
      'name username'
    )
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

// Update repository  // Auth required
// @route UPDATE /:username/:repo/settings
exports.updateRepository = async (req, res, next) => {
  const uname = req.params.username
  req.body.name = req.params.repo // cannot change repository name

  const repositories = await Repository.find({ name: req.params.repo })
  if (repositories.length === 0)
    return next(new extError('No such repository found 1', 400, 'repository'))
  for (let i = 0; i < repositories.length; i++) {
    if (repositories[i].username === uname) {
      const repo = repositories[i]
      const oldAccess = repo.accessBy
      const updatedRepo = await Repository.findByIdAndUpdate(
        repo._id,
        req.body,
        { new: true }
      )
      const isAccessChanged = updatedRepo.accessBy !== oldAccess ? true : false
      if (isAccessChanged) {
        const user = await User.findById(repo.userId)
        // private -> public
        if (oldAccess === 'private') {
          user.noOfPublicRepositories++
          user.publicRepositories.push(repo._id)
        }
        // public -> private
        else {
          user.noOfPublicRepositories--
          const repoInd = await user.publicRepositories.indexOf(repo._id)
          user.publicRepositories.splice(repoInd, 1)
        }
        await user.save()
      }
      return res.status(200).json({
        desc: 'Repository Updated',
        username: uname,
        repository: repo,
        updates: updatedRepo,
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
      const delRepo = repositories[i]

      const user = await User.findById(delRepo.userId)
      if (delRepo.accessBy === 'public') {
        const publicInd = user.publicRepositories.indexOf(delRepo._id)
        user.publicRepositories.splice(publicInd, 1)
      }
      const privateInd = user.repositories.indexOf(delRepo._id)
      user.repositories.splice(privateInd, 1)
      user.save()

      await Repository.findByIdAndDelete(delRepo._id)

      return res.status(200).json({
        desc: 'Repository Deleted',
        username: uname,
        repository: repo,
      })
    }
  }
  next(new extError('No such repository found 1', 400, 'repository'))
}

// Upload files to repository  // Auth required
// @route POST /:username/:repo/upload
exports.uploadToRepository = async (req, res, next) => {
  try {
    return res.status(201).json({
      desc: 'File(s) uploaded successfully',
      username: req.params.username,
      repository: req.params.repo,
    })
  } catch (err) {
    console.log(err)
    next(new extError('Upload failed', 500, 'repository'))
  }
}
