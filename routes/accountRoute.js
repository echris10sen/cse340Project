// Needed Resources
const accController = require("../controllers/accountController")
const express       = require("express")
const regValidate   = require('../utilities/account-validation')
const router        = new express.Router()
const utils         = require('../utilities')

router.get("/login", utils.handleErrors(accController.buildLogin))
router.get("/registration", utils.handleErrors(accController.buildRegistration))
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utils.handleErrors(accController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    (req, res) => {
        console.log("Login Succeeded").blue;
        res.status(200).send('login process')
    }
)

module.exports = router
