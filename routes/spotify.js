const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");
const auth = require("./auth");
const ach = auth.apiAuthCheck;

/* KKBOX tracks of playlist */
router.post("/:playlist_id/tracks", ach, spotifyController.createTracksList);
router.get("/:playlist_id/tracks", spotifyController.readTracksList);
router.put("/:playlist_id/tracks", ach, spotifyController.updateTracksList);
router.delete("/:playlist_id/tracks", ach, spotifyController.deleteTracksList);

module.exports = router;
