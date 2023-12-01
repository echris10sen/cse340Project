// Needed Resources
const express       = require("express")
const classValidate = require('../utilities/inventory-validation')
const invController = require("../controllers/invController")
const invValidate   = require("../utilities/inventory-validation")
const router        = new express.Router()
const utilities     = require("../utilities")

//Route by defalut
router.get("/", utilities.handleErrors(invController.buildManager));

// Route by Add Classification
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post(
    "/addClassification",
    classValidate.addClassificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
    );
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
    "/addInventory",
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
    );



// Route by Classification ID
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route by Vehicle ID
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

module.exports = router;
