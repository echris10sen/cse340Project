// Needed Resources
const express       = require("express")
const classValidate = require('../utilities/inventory-validation')
const invController = require("../controllers/invController")
const invValidate   = require("../utilities/inventory-validation")
const router        = new express.Router()
const utilities     = require("../utilities")

//Route by defalut
router.get("/", 
    invValidate.checkAccountType,
    utilities.handleErrors(invController.buildManager));

// Route by Add Classification
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post(
    "/addClassification",
    classValidate.addClassificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
    );

// Route by Add Inventory
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
    "/addInventory",
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
    );

// Route by Get Inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Route by Modify Inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory))
router.post("/update/",
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route by Delete Inventory
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

// Route by Classification ID
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route by Vehicle ID
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

module.exports = router;
