const express = require("express");
const router = express.Router();
const kkboxController = require("../controllers/kkboxController");
const auth = require("./auth");
const ach = auth.apiAuthCheck;

/* KKBox charts*/
router.post("/kkbox/charts", ach, kkboxController.createChartsList);
router.get("/kkbox/charts", kkboxController.readChartsList);
router.put("/kkbox/charts", ach, kkboxController.updateChartsList);
router.delete("/kkbox/charts", ach, kkboxController.deleteChartsList);

module.exports = router;
