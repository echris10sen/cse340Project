// Needed Resources
const accController = require("../controllers/accountController")
const express       = require("express")
const regValidate   = require('../utilities/account-validation')
const router        = new express.Router()
const utils         = require('../utilities')



// Routes

// Default route
router.get("/", 
    utils.checkLogin,
    utils.handleErrors(accController.buildAccountView))

router.get("/login", utils.handleErrors(accController.buildLogin))
router.get("/registration", utils.handleErrors(accController.buildRegistration))

// Process the registration attempt
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
    utils.handleErrors(accController.accountLogin)
)

// Logout
router.get("/logout", utils.handleErrors(accController.accountLogout))

// Update Account
router.get("/update", utils.handleErrors(accController.buildUpdateAccount))
router.post("/update", 
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utils.handleErrors(accController.updateAccount))

router.post("/updatePassword", 
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utils.handleErrors(accController.updateAccountPassword))


module.exports = router
