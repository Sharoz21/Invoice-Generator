const express = require("express");
const routeController = require("../controllers/routeController");

const router = express.Router();

router.route("").get(routeController.getFormPage);
router.route("/:id").get(routeController.getDownloadPage);

module.exports = router;
