/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements In alphebetical order
 *************************/
const accountRoute    = require('./routes/accountRoute');
const baseController  = require('./controllers/baseController');
const bodyParser      = require('body-parser');
const colors          = require("colors");
const cookieParser    = require('cookie-parser');
const env             = require("dotenv").config();
const express         = require("express");
const expressLayouts  = require('express-ejs-layouts');
const inventoryRoute  = require('./routes/inventoryRoute');
const pool            = require('./database/');
const session         = require("express-session");
const static          = require("./routes/static");
const utilities       = require('./utilities/');

const app = express()
// For simple Debugging
colors.enable()

/******************************************
 * Middleware
 *****************************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name:'sessionId'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))



// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(cookieParser());
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Routes
 *************************/
app.use(static)

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)



// File Not Found Route - Must be Last Route in List
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/************************************
 * Express Error Handler
 * Place after all ofther middleware
 ***********************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  const header = await utilities.buildHeader(res.locals.loggedin);
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message 
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    header,
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
