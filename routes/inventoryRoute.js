// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route by Classification ID
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route by Vehicle ID
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

module.exports = router;
