const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req,res) {
    const nav = await utilities.getNav()
    const header = await utilities.buildHeader(res.locals.loggedin);
    console.log(await `header: ${header}`);
    // req.flash("notice", "This is a flash message")
    res.render("index", { title: "Home", header, nav})
}

module.exports = baseController