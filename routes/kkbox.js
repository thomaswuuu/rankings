const express = require("express");
const router = express.Router();
const kkboxController = require("../controllers/kkboxController");
const auth = require("./auth");
const ach = auth.apiAuthCheck;

/* KKBOX tracks of playlist */
router.post("/:playlist_id/tracks", ach, kkboxController.createTracksList);
router.get("/:playlist_id/tracks", kkboxController.readTracksList);
router.put("/:playlist_id/tracks", ach, kkboxController.updateTracksList);
router.delete("/:playlist_id/tracks", ach, kkboxController.deleteTracksList);

module.exports = router;
