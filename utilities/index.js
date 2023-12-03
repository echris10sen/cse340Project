invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/*****************************************
 * Constructs the nav HTML unordered list
 *****************************************/
Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications();
    let list = '<ul id="navbar" class="">';
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach( row => {
        list += "<li>"
        list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`
        list += "</li>"
    });
    list += "</ul>";
    return list;
}

/**************************************
 * Build links for the site
 * ***********************************/
Util.buildHeader = async function (loggedin) {
    console.log(`loggedin: ${loggedin}`);
    let header = ""; 
    header += `<header id="top-header"> 
        <span class="siteName">
            <a href="/" title="Return to horme page">CSE Motors</a>
        </span>`
    
    if (!loggedin) {
        header += 
        `<div id="tools">
            <a href="/account/login" title="Click to log in">Login</a>
        </div>`
    } else {
        header += 
        `<div id="tools">
            <a href="/account/" title="Click to view your account">My Account</a>
            <a href="/account/logout" title="Click to log out">Logout</a>
        </div>`
    }
    header += `</header>`;
    return header;
}

/**************************************
 * Build the classification view HTML
 **************************************/
Util.buildClassificationGrid = async function (data) {
    let grid
    if(data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach( vehicle => {
            grid += '<li>'
            grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" on CSE Motors /></a>`
            grid += '<div class = "namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"> ${vehicle.inv_make} ${vehicle.inv_model}</a>`
            grid +='</h2>'
            grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class"notice">Sorry, no mathcing vehicles could be found.</p>'
    }
    return grid
}

/**************************************
 * Build the information for the detail view
 * **************************************/

Util.buildInformation = async function (data) {
    let view
    let item = data[0]
    if (data.length > 0){
        miles = item.inv_miles.toLocaleString();
        price = item.inv_price.toLocaleString();
        console.log(miles);
        // Add the grid
        view = `<section class="item-display">`
        
        // Add card 1 images & description
        view += `<div class="item-card">`
        view += `<img id="inv_img"src="${item.inv_img}" alt="Batmobile">`
        view += `</div>`
        
        // Add card 2 price
        view += `<div class="item-card">`
        //information
        view += `<p id="inv_description">${item.inv_description}</p>`
        view += `<p id="inv_color">Color: ${item.inv_color}</p>`  
        view += `<p id="miles">Mileage: ${miles}</p>`
        view += `</div>`
        
        // Add card 3 Other Information
        view += `<div class="item-card">`
        view += `<p id="inv_price">$ ${price}</p>`
        view += `</div>`

        view += `</section>`
    }   
    return view
}

/***********************************
 * Build the management view HTML
 **********************************/
Util.buildManagementView = async function () {
    let view = "";
    view += `<div id="managmentWrapper">`
    view += `<button type="button" onclick="location.href='/inv/addClassification'">New Classification</button>`
    view += `<button onclick="location.href='/inv/addInventory'">New Inventory</button>`
    view += `</div>`
    view += `<div id="managementGrid">`
    view += `<h2>Manage Inventory</h2>`
    view += `<p>Select a classification from the list to see the items belonging to the classification</p>`
    return view;
}

/***********************************
 * Build Account Type View
 * *********************************/
Util.buildAccountTypeView = async function (accountData) {
    console.log(`In buildAccountTypeView: ${accountData.account_type}`);
    let view = "";
    view += `<h2>Welcome ${accountData.account_firstname}</h2>`
    view += `<button type="button" onclick="location.href='./update'">Update Account Information</button>`
    if (accountData.account_type != "Client") {
        view += `<h3>Inventory Management</h3>`
        view += `<p><a href="/inv/">Manage Inventory</a></p>`
    }
    return view;
}

/* ************************************
 * Middleware to check token validity
 * **********************************/
Util.checkJWTToken = (req, res, next) => {
    try{
        if (req.cookies.jwt || req.cookies.jwt != undefined) {
            jwt.verify(
                req.cookies.jwt,
                process.env.ACCESS_TOKEN_SECRET,
                function (err, accountData) {
                    if (err) {
                        req.flash("Please log in")
                        res.clearCookie("jwt")
                        return res.redirect("/account/login")
                    }
                    res.locals.accountData = accountData
                    res.locals.loggedin = 1
                    next()
                })
        } else {
            console.log("No JWT Token");
            res.locals.loggedin = 0
            console.log(`res.locals.loggedin: ${res.locals.loggedin}`.blue);
            next()
        }
    } catch (err){
        console.log(err);
        next()
    }
}

/* ************************************
 * Check Login
 * **********************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        console.log("In checkLogin");
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/***********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 ***********************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;