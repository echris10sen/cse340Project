// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route by Classification ID
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route by Vehicle ID
router.get("/detail/:invId", invController.buildByInvId);

module.exports = router;
