const inventoryModel = require("../models/inventory-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};


/*****************************************
 * Add Classification Validation Rules
 * ***************************************/
validate.addClassificationRules = () => {
    console.log("In addClassificationRules function");
    return [
        // classification name is required and must be string
        body("classification_name")
            .trim()
            .isAlpha("en-US")
            .withMessage("Please provide a valid classification name.")
            .isLength({ min: 4 })
            .withMessage("Please provide a valid classification name.") // on error this message is sent.
            .custom(async (classification_name) => {
                const nameExists = await inventoryModel.checkExistingName(classification_name);
                if (nameExists) {
                    throw new Error("Classification name exists. Please use different name.")
                }
            })
    ];
}

/*****************************************
 * Check Classification Data
 * ***************************************/

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const header = await utilities.buildHeader(res.locals.loggedin);
        res.render("inventory/add-classification", {
            errors,
            nav,
            header,
            title: "Add Classification",
            classification_name
        });
    } else {
        next();
    }
}

/*****************************************
 * Add Inventory Validation Rules
 * ***************************************/
validate.addInventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Make."),

        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Model."),
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: 2022 })
            .withMessage("Please provide a year between 1900 and 2022.")
            .isLength({ min: 4, max: 4 })
            .withMessage("Please provide a year in the following format YYYY."),
        body("inv_description")
            .trim()
            .isLength({ min: 1, max: 255 })
            .withMessage("Please provide the Description."),
        body("inv_img")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Image."),
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Thumbnail."),
        body("inv_price")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Price.")
            .isInt({ min: 1 })
            .withMessage("Please provide the Price at a value greater than 1."),

        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Please provide the Miles at a value of at least 0.")
            .isLength({ min: 1 })
            .withMessage("Please provide the Miles."),
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Color."),
        body("classification_id")
            .trim()
            .isInt({ min: 1 })
            .withMessage("Please provide the Classification ID.")
    ]
}

/*****************************************
 * Check Inventory Data
 * ***************************************/
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_img, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = await inventoryModel.getClassifications();
        const classifications = data.rows;
        let nav = await utilities.getNav();
        const header = await utilities.buildHeader(res.locals.loggedin);
        res.render("inventory/add-inventory", {
            errors,
            nav,
            header,
            title: "Add Inventory",
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_img,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classifications,
            classification_id
        });
    } else {
        next();
    }
}

/*****************************************
 * Add Inventory Validation Rules
 * ***************************************/
validate.newInventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Make."),

        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Model."),
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: 2022 })
            .withMessage("Please provide a year between 1900 and 2022.")
            .isLength({ min: 4, max: 4 })
            .withMessage("Please provide a year in the following format YYYY."),
        body("inv_description")
            .trim()
            .isLength({ min: 1, max: 255 })
            .withMessage("Please provide the Description."),
        body("inv_img")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Image."),
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Thumbnail."),
        body("inv_price")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Price.")
            .isInt({ min: 1 })
            .withMessage("Please provide the Price at a value greater than 1."),

        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Please provide the Miles at a value of at least 0.")
            .isLength({ min: 1 })
            .withMessage("Please provide the Miles."),
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide the Color."),
        body("classification_id")
            .trim()
            .isInt({ min: 1 })
            .withMessage("Please provide the Classification ID.")
    ]
}


/*****************************************
 * Update Inventory Data
 * ***************************************/
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_img, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = await inventoryModel.getClassifications();
        const classifications = data.rows;
        const name = `${inv_make} ${inv_model}`;
        let nav = await utilities.getNav();
        const header = await utilities.buildHeader(res.locals.loggedin);
        res.render("inventory/edit-inventory", {
            errors,
            nav,
            header,
            title: `Edit ${name}`,
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
            classifications,
            classification_id
        });
    } else {
        next();
    }
}

/*****************************************
 * Check Account Data
 * ***************************************/
validate.checkAccountType = async (req, res, next) => {
    console.log(`In checkAccountType: ${res.locals.accountData.account_type}`);
    if (res.locals.accountData.account_type != "Client" ) {
        next();
    } else {
        let nav = await utilities.getNav();
        const header = await utilities.buildHeader(res.locals.loggedin);
        res.render("errors/error", {
            title: "Error",
            message: "You do not have permission to view this page.",
            header,
            nav: await utilities.getNav()
        });
    }
}
module.exports = validate;