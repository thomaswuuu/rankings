const express = require("express");
const router = express.Router();
const updateContorller = require("../controllers/updateController");
const auth = require("./auth");
const ach = auth.apiAuthCheck;

router.get("/:command", ach, updateContorller.autoUpdateTime);

module.exports = router;
