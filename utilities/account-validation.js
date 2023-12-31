const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*************************************
 * Registration Data Validation Rules
 *************************************/
validate.registrationRules = () => {
    console.log("In registrationRules function")
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),  // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/***********************************************************
 * Check data and return errors or continue to registration
 **********************************************************/
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/registration", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}


validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required."),
            // .custom(async (account_email) => {
            //     const emailExists = await accountModel.checkExistingEmail(account_email)
            //     if (emailExists) {
            //         throw new Error("Email exists. Please log in or use different email")
            //     }
            // }),

    // password is required and must be strong password
    body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    console.log(`${account_email}`.blue);
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
    }
    next();
}


validate.updateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),  // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const currentAccount = await accountModel.getAccountEmailById(req.body.account_id);
                console.log(currentAccount.account_email);
                console.log(currentAccount.account_email !== account_email);
                console.log(account_email);
                if(currentAccount.account_email !== account_email) {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email exists. Please log in or a different email")
                    }
                }
            }),
        body("account_id")
            .trim()
            .isInt()
            .withMessage("Invalid account id")
        ]
}

validate.updatePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
        body("account_id")
            .trim()
            .isInt()
            .withMessage("Invalid account id")
    ]

}
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const header = await utilities.buildHeader(res.locals.loggedin);
        res.render("account/update-account", {
            errors,
            title: "Update Account",
            nav,
            header,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
    next()
}

validate.checkUpdatePasswordData = async (req, res, next) => {
    const { account_password, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const header = await utilities.buildHeader(res.locals.loggedin);
        res.render("account/update-account", {
            errors,
            title: "Update Account",
            nav,
            header,
            account_firstname: res.locals.accountData.account_firstname,
            account_lastname: res.locals.accountData.account_lastname,
            account_email: res.locals.accountData.account_email,
            account_id
        })
        return
    }
    next()
}

module.exports = validate