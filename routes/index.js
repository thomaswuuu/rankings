const express = require("express");
const router = express.Router();
const kkboxController = require("../controllers/kkboxController");
const spotifyController = require("../controllers/spotifyController");
const auth = require("./auth");
const ach = auth.apiAuthCheck;

/* KKBox charts*/
router.post("/kkbox/charts", ach, kkboxController.createChartsList);
router.get("/kkbox/charts", kkboxController.readChartsList);
router.put("/kkbox/charts", ach, kkboxController.updateChartsList);
router.delete("/kkbox/charts", ach, kkboxController.deleteChartsList);

/* Spotify charts*/
router.post("/spotify/charts", spotifyController.createChartsList);
router.get("/spotify/charts", spotifyController.readChartsList);
router.put("/spotify/charts", spotifyController.updateChartsList);
router.delete("/spotify/charts", ach, spotifyController.deleteChartsList);

module.exports = router;
