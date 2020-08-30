const express = require('express')

const router = express.Router()

const {
  getRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
} = require('../controllers/repository')

router.route('/repos').get(getRepositories)

router.route('/:username/new').post(createRepository)

router
  .route('/:username/:repo/settings')
  .put(updateRepository)
  .delete(deleteRepository)

module.exports = router
