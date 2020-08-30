const express = require('express')

const router = express.Router()

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user')

router.route('/:username').get(getUser)

router.route('/:username/settings').put(updateUser).delete(deleteUser)

router.route('/new').post(createUser)

module.exports = router
