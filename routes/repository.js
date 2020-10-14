const { Router } = require('express')
const asyncHandler = require('express-async-handler')
const { authToken } = require('../middlewares/verifyToken')
const { checkView } = require('../middlewares/checkRepoView')

const router = Router()

const {
  getAllRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
} = require('../controllers/repository')

router
  .route('/:username/repos')
  .get(checkView, asyncHandler(getAllRepositories))

router.route('/:username/new').post(authToken, asyncHandler(createRepository))

router
  .route('/:username/:repo/settings')
  .put(authToken, asyncHandler(updateRepository))
  .delete(authToken, asyncHandler(deleteRepository))

module.exports = router
