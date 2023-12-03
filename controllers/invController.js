const { parse } = require("dotenv");
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
    const header = await utilities.buildHeader(res.locals.loggedin);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    console.log(data[0]);
    res.render("./inventory/classification", {
        title: `${className} vehicles`,
        header,
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
    const header = await utilities.buildHeader(res.locals.loggedin);
    const makenModel = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/item", {
        title: `${makenModel}`,
        info,
        nav,
        header,
    })
    
}

/***************************************
 * Build Manager view
 ***************************************/
invCont.buildManager = async function(req, res, next) {
    let nav = await utilities.getNav();
    const header = await utilities.buildHeader(res.locals.loggedin);
    console.log("In buildManager");
    const rawData = await invModel.getClassifications();
    const classifications = rawData.rows;
    const manager = await utilities.buildManagementView()
    
    res.render("./inventory/management", {
        title: `Inventory Manager`,
        header,
        manager,
        nav,
        classifications,
    })
}

/***************************************
 * Build Add Classification view
 ***************************************/
invCont.buildAddClassification = async function(req, res, next) {
    let nav = await utilities.getNav();
    let header = await utilities.buildHeader(res.locals.loggedin);
    res.render("./inventory/add-classification", {
        title: `Add Classification`,
        nav,
        header,
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
    const header = await utilities.buildHeader(res.locals.loggedin);
    const data = await invModel.getClassifications();
    const classifications = data.rows;
    res.render("./inventory/add-inventory", {
        title: `Add to Inventory`,
        nav,
        header,
        errors: null,
        classifications
    });
}

/***************************************
 * Return Inventory by Classification as JSON
 * *************************************/
invCont.getInventoryJSON = async (req, res, next) => {
    console.log(parseInt(req.params.classification_id));
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
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
        const header = await utilities.buildHeader(res.locals.loggedin);
        const manager = await utilities.buildManagementView();
        const data = await invModel.getClassifications();
        const classifications = data.rows;
        console.log("In addInventory");
        req.flash("notice", "Inventory Added");
        res.status(201).render("./inventory/management", {
            title: `Inventory Manager`,
            manager,
            header,
            nav,
            classifications
        });
    } else {
        req.flash("notice", "Inventory Not Added");
        const header = await utilities.buildHeader(res.locals.loggedin);
        const data = await invModel.getClassifications();
        const classifications = data.rows;
        res.status(501).render("/inventory/add-inventory",
        {
            title: `Add to Inventory`,
            nav,
            header,
            errors: null,
            classifications
        });
    }
}

/***************************************
 * Build Edit Inventory view
 ***************************************/
invCont.editInventory = async function(req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const header = await utilities.buildHeader(res.locals.loggedin);
    const invData = await invModel.getInventoryByInvId(inv_id);
    const name = `${invData[0].inv_make} ${invData[0].inv_model}`
    const data = await invModel.getClassifications();
    const classifications = data.rows;
    res.render("./inventory/edit-inventory", {
        title: `Edit ${name}`,
        nav,
        header,
        errors: null,
        classifications,
        inv_id: invData[0].inv_id,
        inv_make: invData[0].inv_make,
        inv_model: invData[0].inv_model,
        inv_year: invData[0].inv_year,
        inv_description: invData[0].inv_description,
        inv_img: invData[0].inv_img,
        inv_thumbnail: invData[0].inv_thumbnail,
        inv_price: invData[0].inv_price,
        inv_miles: invData[0].inv_miles,
        inv_color: invData[0].inv_color,
        classification_id: invData[0].classification_id
    });
}

/***************************************
 * Update Inventory
 ***************************************/
invCont.updateInventory = async function(req, res, next) {
    const {
        inv_id, 
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

    const result = await invModel.updateInventory(
        inv_id,
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
        const itemName = `${result.inv_make} ${result.inv_model}`;
        req.flash("notice", `The ${itemName} was successfully updated`);
        res.redirect("/inv");
    } else {
        const itemName = `${result.inv_make} ${result.inv_model}`;
        let nav = await utilities.getNav();
        const header = await utilities.buildHeader(res.locals.loggedin);
        const data = await invModel.getClassifications();
        const classifications = data.rows;
        req.flash("notice", `Sorry, the insert failed`);
        res.status(501).render("/inventory/edit-inventory",
        {
            title: `Edit ${itemName}`,
            nav,
            header,
            errors: null,
            classifications,
            inv_id,
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
        });
    }
}


/***************************************
 * Build Delete Inventory view
 ***************************************/
invCont.deleteInventoryView = async function(req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const header = await utilities.buildHeader(res.locals.loggedin);
    const invData = await invModel.getInventoryByInvId(inv_id);
    const name = `${invData[0].inv_make} ${invData[0].inv_model}`
    res.render("./inventory/delete-confirm", {
        title: `Delete ${name}`,
        nav,
        header,
        errors: null,
        inv_id: invData[0].inv_id,
        inv_make: invData[0].inv_make,
        inv_model: invData[0].inv_model,
        inv_year: invData[0].inv_year,
        inv_price: invData[0].inv_price
    });
}

/***************************************
 * Delete Inventory
 ***************************************/
invCont.deleteInventory = async function(req, res, next) {
    const { inv_id, inv_make, inv_model, inv_year, inv_price } = await req.body;
    console.log(inv_id, inv_make, inv_model, inv_year, inv_price);
    const name = `${inv_make} ${inv_model}`;
    let nav = await utilities.getNav();
    const header = await utilities.buildHeader(res.locals.loggedin);
    const result = await invModel.deleteInventory(parseInt(inv_id));
    console.log(result);

    if (result) {

        req.flash("notice", `The ${name} was successfully Deleted`);
        res.redirect("/inv");
    } else {
        req.flash("notice", `Sorry, the delete failed`);
        res.status(501).render("./inventory/delete-confirm",
        {
            title: `Delete ${name} `,
            nav,
            header,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
     
        });
    }
}
module.exports = invCont;