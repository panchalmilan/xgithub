const { Router } = require('express')
const asyncHandler = require('express-async-handler')

const router = Router()

const {
  getRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
} = require('../controllers/repository')

router.route('/repos').get(asyncHandler(getRepositories))

router.route('/:username/new').post(asyncHandler(createRepository))

router
  .route('/:username/:repo/settings')
  .put(asyncHandler(updateRepository))
  .delete(asyncHandler(deleteRepository))

module.exports = router
