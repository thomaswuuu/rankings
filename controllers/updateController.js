const updateModel = require("../models/updateModel");
const kkboxModels = require("../models/kkboxModel");
const kkboxCharts = kkboxModels.getChartsModel();
const kkboxTracks = kkboxModels.getTracksModel();
const spotifyModels = require("../models/spotifyModel");
const spotifyCharts = spotifyModels.getChartsModel();
const spotifyTracks = spotifyModels.getTracksModel();
let kkboxIntervalID = "";
let spotifyIntervalID = "";

const updateTracksData = (type, chart_ids, delayTime) => {
  try {
    const platformModels = type == "kkbox" ? kkboxModels : spotifyModels;
    const tracksModel = type == "kkbox" ? kkboxTracks : spotifyTracks;
    chart_ids.map((chart_id, index) => {
      let delay = delayTime + index * 1000;
      setTimeout(async () => {
        // Get track list data
        const tracksList = await platformModels.getTracksData(chart_id);
        tracksList.map((item) => {
          const queryData = { id: item.id, rankNo: item.rankNo };
          const updateData = {
            track_id: item.track_id,
            title: item.title,
            album: item.album,
            artist: item.artist,
            titleLink: item.titleLink,
            albumLink: item.albumLink,
            artistLink: item.artistLink,
            cover: item.cover,
            release_date: item.release_date,
          };
          // Save to database
          tracksModel.findOneAndUpdate(queryData, updateData).catch((error) => {
            throw error;
          });
        });
        // console.log(type, delay, chart_id, new Date().getTime());
      }, delay);
    });
    // Save update time to database
    updateModel.find().then(async (updteData) => {
      const date = new Date();
      const updateInfo = {
        platform: type,
        updateAt: date.toString().slice(0, 24),
      };
      if (updteData.length >= 10) await updateModel.findOneAndDelete();
      const update = new updateModel(updateInfo);
      update.save().catch((error) => {
        throw error;
      });
    });
  } catch (error) {
    throw error;
  }
};

const autoUpdateTime = async (req, res) => {
  try {
    const command = req.params.command;
    const intervalTime = 60 * 60 * 1000; // 1 hour
    if (command == "start") {
      /* Start auto update */
      // KKBOX
      const chart_kids = (await kkboxCharts.find({}, "id")).map(
        (value) => value.id
      );
      updateTracksData("kkbox", chart_kids, 0);
      kkboxIntervalID = setInterval(async () => {
        updateTracksData("kkbox", chart_kids, 0);
      }, intervalTime);

      // Spotify
      const chart_sids = (await spotifyCharts.find({}, "id")).map(
        (value) => value.id
      );
      // Wait 30 seconds for updating completed
      updateTracksData("spotify", chart_sids, 30 * 1000);
      spotifyIntervalID = setInterval(async () => {
        updateTracksData("spotify", chart_sids, 30 * 1000);
      }, intervalTime);
      res.json({ message: "Start OK" });
    } else if (command == "stop") {
      /* Stop auto update */
      clearInterval(kkboxIntervalID);
      clearInterval(spotifyIntervalID);
      res.json({ message: "Stop OK" });
    } else if (command == "status") {
      const updateAt = await updateModel.find();
      res.json(
        updateAt.reverse().map((item) => {
          return {
            playform: item.platform,
            updateAt: item.updateAt,
          };
        })
      );
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  autoUpdateTime,
};
