const express = require("express");
const router = express.Router();
const updateContorller = require("../controllers/updateController");

router.get("/:command", updateContorller.autoUpdateTime);

module.exports = router;
