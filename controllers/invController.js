const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/*****************************************
 * Build inventory by classification view
 *****************************************/
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    console.log(data[0]);
    res.render("./inventory/classification", {
        title: `${className} vehicles`,
        nav,
        grid,
    })
}

/*******************************
 * Build inventory item view
 *******************************/
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id);
    const info = await utilities.buildInformation(data);
    
    let nav = await utilities.getNav();
    const makenModel = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/item", {
        title: `${makenModel}`,
        info,
        nav
    })
    
}
module.exports = invCont;