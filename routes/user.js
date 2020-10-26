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

/**
 * @swagger
 * /xgithub/username:
 *  get:
 *    summary: Get All books sum
 *    description: Get All books desc
 *    responses:
 *      200:
 *        description: User info
 *        content:
 *          application/json
 */
router.route('/:username').get(authToken, asyncHandler(getUser))

router
  .route('/:username/settings')
  .put(authToken, asyncHandler(updateUser))
  .delete(authToken, asyncHandler(deleteUser))

router.route('/new').post(asyncHandler(createUser))

module.exports = router
