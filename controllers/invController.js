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

/***************************************
 * Build Manager view
 ***************************************/
invCont.buildManager = async function(req, res, next) {
    let nav = await utilities.getNav();
    console.log("In buildManager");
    const manager = await utilities.buildManagementView()
    res.render("./inventory/management", {
        title: `Inventory Manager`,
        manager,
        nav
    })
}

/***************************************
 * Build Add Classification view
 ***************************************/
invCont.buildAddClassification = async function(req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: `Add Classification`,
        nav,
        errors: null,
    });
}

/***************************************
 * Add Classification
 ***************************************/
invCont.addClassification = async function(req, res, next) {
    const { classification_name } = await req.body
    const result = await invModel.addClassification(classification_name);
    console.log(result);

    if (result) {
        req.flash("notice", "Classification Added");
        res.status(200).redirect("/inv");
    } else {
        req.flash("notice", "Classification Not Added");
        res.status(501).redirect("/inv/addClassification");
    }
}

/***************************************
 * Build Add Inventory view
 ***************************************/
invCont.buildAddInventory = async function(req, res, next) {
    let nav = await utilities.getNav();
    const data = await invModel.getClassifications();
    const classifications = data.rows;
    res.render("./inventory/add-inventory", {
        title: `Add to Inventory`,
        nav,
        errors: null,
        classifications
    });
}

/***************************************
 * Add Inventory
 ***************************************/
invCont.addInventory = async function(req, res, next) {
    const { 
        inv_make,
        inv_model, 
        inv_year, 
        inv_description, 
        inv_img,
        inv_thumbnail,
        inv_price, 
        inv_miles, 
        inv_color,  
        classification_id 
    } = await req.body

    const result = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_img,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    );
    console.log(result);

    if (result) {
        let nav = await utilities.getNav();
        const manager = await utilities.buildManagementView();
        console.log("In addInventory");
        req.flash("notice", "Inventory Added");
        res.status(201).render("./inventory/management", {
            title: `Inventory Manager`,
            manager,
            nav
        });
    } else {
        req.flash("notice", "Inventory Not Added");
        const data = await invModel.getClassifications();
        const classifications = data.rows;
        res.status(501).render("/inventory/add-inventory",
        {
            title: `Add to Inventory`,
            nav,
            errors: null,
            classifications
        });
    }
}

module.exports = invCont;