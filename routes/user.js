const { Router } = require('express')
const asyncHandler = require('express-async-handler')

const router = Router()

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user')

router.route('/:username').get(asyncHandler(getUser))

router
  .route('/:username/settings')
  .put(asyncHandler(updateUser))
  .delete(asyncHandler(deleteUser))

// router.route('/new').post(createUser)
router.route('/new').post(asyncHandler(createUser))

module.exports = router
