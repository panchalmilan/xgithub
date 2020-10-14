const { Router } = require('express')
const router = Router()

const { loginUser } = require('../controllers/auth')

router.route('/login').post(loginUser)

module.exports = router
