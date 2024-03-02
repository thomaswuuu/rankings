const updateModels = require("../models/updateModel");
const updateTime = updateModels.getUpdateTime();
const updateStatus = updateModels.getUpdateStatus();
const kkboxModels = require("../models/kkboxModel");
const kkboxCharts = kkboxModels.getChartsModel();
const kkboxTracks = kkboxModels.getTracksModel();
const spotifyModels = require("../models/spotifyModel");
const spotifyCharts = spotifyModels.getChartsModel();
const spotifyTracks = spotifyModels.getTracksModel();
let kkboxIntervalID = "";
let spotifyIntervalID = "";

const updateTracksData = async (type, chart_ids) => {
  try {
    const platformModels = type == "kkbox" ? kkboxModels : spotifyModels;
    const tracks = type == "kkbox" ? kkboxTracks : spotifyTracks;
    // Delete old tracks list
    await tracks.deleteMany();
    // Get new tracks list
    chart_ids.map((chart_id, index) => {
      // console.log(`${type} chart_id=${chart_id}`);
      let delay = index * 1000;
      // Delay for sequential execution
      setTimeout(async () => {
        const tracksList = await platformModels.getTracksData(chart_id);
        await tracks.insertMany(tracksList);
      }, delay);
    });
    // Save update time to database
    updateTime.find().then(async (updteData) => {
      const date = new Date();
      const updateInfo = {
        platform: type,
        updateAt: date,
      };
      if (updteData.length >= 10) await updateTime.findOneAndDelete();
      const update = new updateTime(updateInfo);
      update.save().catch((error) => {
        throw error;
      });
    });
  } catch (error) {
    throw error;
  }
};

const updateChartsAndTracksData = async (type, delayTime) => {
  try {
    const platformModels = type == "kkbox" ? kkboxModels : spotifyModels;
    const charts = type == "kkbox" ? kkboxCharts : spotifyCharts;

    setTimeout(async () => {
      // Get new charts list
      const chartsList = await platformModels.getChartsData();
      // Delete old charts list
      await charts.deleteMany();
      // Save new charts list
      await charts.insertMany(chartsList);
      // Return new chart ids
      const chart_ids = chartsList.map((value) => value.id);
      updateTracksData(type, chart_ids);
    }, delayTime);
  } catch (error) {
    throw error;
  }
};

const autoUpdateTime = async (req, res) => {
  try {
    const command = req.params.command;
    const intervalTime = 24 * 60 * 60 * 1000; // 1 day
    if (command == "start") {
      /* Start auto update */
      const statusInfo = await updateStatus.findOne();
      if (!Boolean(statusInfo) || statusInfo.status == "Disabled") {
        // KKBOX
        let delayTime = 0;
        updateChartsAndTracksData("kkbox", delayTime);
        kkboxIntervalID = setInterval(async () => {
          updateChartsAndTracksData("kkbox", delayTime);
        }, intervalTime);

        // Spotify
        delayTime = 30 * 1000;
        // Wait 30 seconds for kkbox updating completed
        updateChartsAndTracksData("spotify", delayTime);
        spotifyIntervalID = setInterval(async () => {
          updateChartsAndTracksData("spotify", delayTime);
        }, intervalTime);
        // Set status enable
        const data = { status: "Enabled" };
        updateStatus.deleteOne().then(() => {
          new updateStatus(data)
            .save()
            .then(() => {
              res.json({ message: "Start OK" });
            })
            .catch((error) => {
              res.json({ message: error.message });
            });
        });
      } else {
        res.json({ message: "Auto updating is running!" });
      }
    } else if (command == "stop") {
      /* Stop auto update */
      clearInterval(kkboxIntervalID);
      clearInterval(spotifyIntervalID);
      // Set status disable
      const data = { status: "Disabled" };
      updateStatus.deleteOne().then(() => {
        new updateStatus(data)
          .save()
          .then(() => {
            res.json({ message: "Stop OK" });
          })
          .catch((error) => {
            res.json({ message: error.message });
          });
      });
    } else if (command == "time") {
      const updateInfo = await updateTime.find();
      res.json(
        updateInfo.reverse().map((item) => {
          return {
            platform: item.platform,
            updateAt: item.updateAt,
          };
        })
      );
    } else if (command == "status") {
      const update = await updateStatus.findOne();
      res.json({
        status: update.status,
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  autoUpdateTime,
};
