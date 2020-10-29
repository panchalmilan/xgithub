const { Router } = require('express')
const asyncHandler = require('express-async-handler')
const { authToken } = require('../middlewares/verifyToken')
const { checkView } = require('../middlewares/checkRepoView')
const upload = require('../config/multer')

const router = Router()

const {
  getAllRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
  uploadToRepository,
} = require('../controllers/repository')

const numFilesLimit = 20

router
  .route('/:username/repos')
  .get(checkView, asyncHandler(getAllRepositories))

router.route('/:username/new').post(authToken, asyncHandler(createRepository))

router
  .route('/:username/:repo/settings')
  .put(authToken, asyncHandler(updateRepository))
  .delete(authToken, asyncHandler(deleteRepository))

router
  .route('/:username/:repo/upload')
  .post(
    authToken,
    upload.array('files', numFilesLimit),
    asyncHandler(uploadToRepository)
  ) //'files' is the field name

module.exports = router
