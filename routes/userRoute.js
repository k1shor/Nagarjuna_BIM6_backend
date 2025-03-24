const { register, verifyUser, forgetPassword, resetPassword, signin } = require('../controller/userController')

const router = require('express').Router()

router.post('/register', register)
router.get('/verify/:token', verifyUser)
router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token', resetPassword)

router.post('/login', signin)

module.exports = router