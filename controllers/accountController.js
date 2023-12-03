//Require statements
const accountModel  = require('../models/account-model')
const bcrypt        = require("bcryptjs")
const jwt           = require("jsonwebtoken")
const utilities     = require('../utilities')
require("dotenv").config()

/*************************
 * Deliver login view
 * **********************/
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        header,
    })
}

/***************************
 * Deliver Registration View
 ***************************/
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    res.render("account/registration",{
        title: "Registration",
        nav,
        errors: null,
        header,
    })
}

/***************************
 * Process Registration
 **************************/
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    console.log(`Here is the body!${req.body}`);
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    //Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice, 'Sorry there was an error processing the registration.")
        req.status(500).render("account/registration", {
            title: "Registration",
            nav,
            errors: null,
            header,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    console.log(regResult);

    if(regResult) {
        req.flash(
            "notice",
            `Congradulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            header,
        })
    } else {
        req.flash("notice", "Sorry the registration failed.")
        res.status(501).render("account/registration", {
            title: "Registration",
            nav,
            errors: null,
            header,
        })
    }
}

/***************************
 * Process Login request
 * ***********************/
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    const { account_email, account_password } = req.body
    console.log("in accountLogin")
    const accountData = await accountModel.getAccountByEmail(account_email)
    console.log(accountData);
    if(!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            header,
            errors: null,
            account_email,
        })
        return
    }
    try {
        console.log(await bcrypt.compare(account_password, accountData.account_password));
        let check = await bcrypt.compare(account_password, accountData.account_password)
        console.log(check);
        if(check) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            console.log(res.cookie);
            return res.redirect("/account/")
        } else {
            console.log("in else");
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                header,
                errors: null,
                account_email,
            })
            next()
            // return
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

/***************************
 * Build Account Management View
 * ***********************/
async function buildAccountView(req, res) {
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    console.log(`In buildAccountView: ${res.locals.accountData.account_firstname}`);
    const account_type_view = await utilities.buildAccountTypeView(res.locals.accountData)
    res.render("account/account", {
        title: "Account Management",
        nav,
        errors: null,
        header,
        account_type_view
    })
}

async function buildUpdateAccount(req, res) {
    console.log("In updateAccount");
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    console.log(res.locals.accountData);
    const { account_id, account_firstname, account_lastname, account_email } = await accountModel.getAccountById(res.locals.accountData.account_id);
    if(!account_id) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            header,
            errors: null,
            account_email
        })
    } else {
        res.status(200).render("account/update-account", {
            title: "Update Account",
            nav,
            header,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
}

async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    console.log(`In updateAccount: ${account_id}`);
    
    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )
    console.log(updateResult);
    if(updateResult) {
        res.locals.accountData = await accountModel.getAccountById(account_id);
        const accessToken = jwt.sign(res.locals.accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        const account_type_view = await utilities.buildAccountTypeView(res.locals.accountData)
        req.flash("notice", "Account updated successfully.")
            res.render("account/account", {
            title: "Account Management",
            nav,
            header,
            errors: null,
            account_type_view
        })
    } else {
        req.flash("notice", "Sorry, there was an error updating your account.")
        res.render("/account/update-account", {
            title: "Update Account",
            nav,
            header,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
    }
}

async function updateAccountPassword(req, res) {
    let nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    const { account_password, account_id } = req.body
    //Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice, 'Sorry there was an error processing the registration.")
        req.status(500).render("account/registration", {
            title: "Registration",
            nav,
            errors: null,
            header,
        })
    }
    const updateResult = await accountModel.updateAccountPassword(
        hashedPassword,
        account_id
    )
    console.log(updateResult);
    if(updateResult) {
        const account_type_view = await utilities.buildAccountTypeView(res.locals.accountData)
        req.flash("notice", "Account updated successfully.")
            res.render("account/account", {
            title: "Account Management",
            nav,
            header,
            errors: null,
            account_type_view
        })
    } else {
        req.flash("notice", "Sorry, there was an error updating your account.")
        res.render("/account/update-account", {
            title: "Update Account",
            nav,
            header,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
    }

}

async function accountLogout(req, res) {
    res.clearCookie("jwt")
    res.redirect("/")
}

module.exports = { 
    accountLogin, 
    buildAccountView, 
    buildLogin, 
    buildRegistration, 
    registerAccount, 
    buildUpdateAccount,
    updateAccount,
    updateAccountPassword,
    accountLogout
}