const { Router } = require('express')
const asyncHandler = require('express-async-handler')
const { authToken } = require('../middlewares/verifyToken')

const router = Router()

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user')

router.route('/:username').get(authToken, asyncHandler(getUser))

router
  .route('/:username/settings')
  .put(authToken, asyncHandler(updateUser))
  .delete(authToken, asyncHandler(deleteUser))

router.route('/new').post(asyncHandler(createUser))

module.exports = router
