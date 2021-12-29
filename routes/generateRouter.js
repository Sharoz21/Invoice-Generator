const express = require("express");
const generateController = require("../controllers/generateController");
const router = express.Router();

router
	.route("")
	.post(
		generateController.uploadImage,
		generateController.compressImage,
		generateController.generateInvoice
	);

module.exports = router;
