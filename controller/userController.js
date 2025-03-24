const UserModel = require('../models/UserModel')
const TokenModel = require('../models/TokenModel')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const emailSender = require('../middleware/emailSender')

const jwt = require('jsonwebtoken')

// register
exports.register = async (req, res) => {
    const { username, email, password } = req.body

    // check if username is available
    let usernameExists = await UserModel.findOne({ username })
    if (usernameExists) {
        return res.status(400).json({ error: "Username not available" })
    }

    // check if email is already registered
    let emailExists = await UserModel.findOne({ email })
    if (emailExists) {
        return res.status(400).json({ error: "Email already registered" })
    }

    // encrypt password
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)

    // register user
    let user = await UserModel.create({
        username,
        email,
        password: hashedPassword
    })
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    // generate verification token
    const token = await TokenModel.create({
        user: user._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    // send token in email
    const VERIFY_URL = `http://localhost:5000/verify/${token.token}`

    emailSender({
        from: "noreply@something.com",
        to: email,
        subject: "Verification E-mail",
        text: "This is a verification email. " + VERIFY_URL,
        html: `<a href='${VERIFY_URL}'><button>Verify Now</button></a>`
    })

    // send message to user
    res.send({ message: "User registered Successfully", user })
}

// verify user
exports.verifyUser = async (req, res) => {
    // check if token is valid or not
    let token = await TokenModel.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    // find user associated with token
    let user = await UserModel.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User associated with token not found." })
    }
    // check if already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified" })
    }
    // verify user
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Failed to verify. Try again later." })
    }
    // send msg to user
    res.send({ message: "User verified Successfully" })
}

// forgetpassword
exports.forgetPassword = async (req, res) => {
    // check if email is registered or not
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }

    // generate password reset token
    let token = await TokenModel.create({
        user: user._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong." })
    }

    // send token in email
    const PASSWORDRESET_LINK = `http://localhost:5000/resetpassword/${token.token}`
    emailSender({
        from: `noreply@something.com`,
        to: req.body.email,
        subject: `Password reset Email`,
        text: `Copy paste it in browser. ${PASSWORDRESET_LINK}`,
        html: `<a href='${PASSWORDRESET_LINK}'><button>RESET PASSWORD</button></a>`
    })

    // send msg to user
    res.send({ message: "Password reset link has been sent to your email." })
}

// reset password
exports.resetPassword = async (req, res) => {
    // check if token is valid or not
    let token = await TokenModel.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    // find user associated with token
    let user = await UserModel.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User associated with token not found." })
    }
    // encrypt password
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    // save document
    user.password = hashedPassword
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong."})
    }
    // send msg to user
    res.send({message:"Password reset successful"})
}

// login
exports.signin = async (req, res) => {
    // check if email is registered or not
    let user = await UserModel.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered"})
    }

    // check password
    let passwordMatch = await bcrypt.compare(req.body.password, user.password)
    if(!passwordMatch){
        return res.status(400).json({error:"Email and Password do not match"})
    }

    // check if email is verified or not
    if(!user.isVerified){
        return res.status(400).json({error:"User not verified."})
    }

    // generate login token using jwt - jsonwebtoken
    let token = jwt.sign({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, "JWT SECRET FOR LOGIN")

    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }


    // send token/message to user
    res.send(token)
}