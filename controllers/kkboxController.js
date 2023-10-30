const kkboxModels = require("../models/kkboxModel");
const chartsModel = kkboxModels.getChartsModel();
const TracksModel = kkboxModels.getTracksModel();
const messages = kkboxModels.getMessages();

/* Create charts list with access token */
const createChartsList = async (req, res) => {
  try {
    const length = await chartsModel.count();
    if (length == 0) {
      // Get charts list
      const chartsList = await kkboxModels.getChartsData();
      // Save charts list
      chartsModel
        .insertMany(chartsList)
        .then(() => {
          res.status(201).json({ message: messages.success("C") });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({ message: messages.failed("C") });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Create tracks list */
const createTracksList = async (req, res) => {
  try {
    const playlist_id = req.params.playlist_id;
    const tracksLength = await TracksModel.count({ id: playlist_id });
    if (tracksLength == 0) {
      // Save tracks of playlist
      const tracksList = await kkboxModels.getTracksData(playlist_id);
      TracksModel.insertMany(tracksList)
        .then(() => {
          res.status(201).json({ message: messages.success("C") });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({ message: messages.failed("C") });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Read charts list */
const readChartsList = async (req, res) => {
  try {
    const charts = await chartsModel.find().sort({ chartNo: 1 }).exec();
    const chartsList = [];
    charts.forEach((chart) => {
      chartsList.push({
        id: chart.id,
        title: chart.title,
        cover: chart.cover,
      });
    });

    if (chartsList.length) res.status(200).json(chartsList);
    else res.status(400).json({ message: messages.failed("R") });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Read tracks list */
const readTracksList = async (req, res) => {
  try {
    const playlist_id = req.params.playlist_id;
    const tracks = await TracksModel.find({ id: playlist_id })
      .sort({ rankNo: 1 })
      .exec();
    const tracksList = [];
    tracks.forEach((track) => {
      tracksList.push({
        track_id: track.track_id,
        rankNo: track.rankNo,
        title: track.title,
        album: track.album,
        artist: track.artist,
        link: track.link,
        cover: track.cover,
        release_date: track.release_date,
      });
    });

    if (tracksList.length) res.status(200).json(tracksList);
    else res.status(400).json({ message: messages.failed("R") });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update charts list with access token */
const updateChartsList = async (req, res) => {
  try {
    const length = await chartsModel.count();
    if (length) {
      // Update new charts data
      const chartsList = await kkboxModels.getChartsData();
      chartsList.forEach((item) => {
        const queryData = { id: item.id, chartNo: item.chartNo };
        const updateData = {
          title: item.title,
          cover: item.cover,
        };
        chartsModel.findOneAndUpdate(queryData, updateData).catch((error) => {
          throw error;
        });
      });
      res.status(201).json({ message: messages.success("U") });
    } else {
      res.status(400).json({ message: messages.failed("U") });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update tracks list */
const updateTracksList = async (req, res) => {
  try {
    const playlist_id = req.params.playlist_id;
    const length = await TracksModel.count({ id: playlist_id });

    if (length) {
      // Update new tracks data
      const tracksList = await kkboxModels.getTracksData(playlist_id);
      tracksList.forEach((item) => {
        const queryData = { id: item.id, rankNo: item.rankNo };
        const updateData = {
          track_id: item.track_id,
          title: item.title,
          album: item.album,
          artist: item.artist,
          link: item.link,
          cover: item.cover,
          release_date: item.release_date,
        };
        TracksModel.findOneAndUpdate(queryData, updateData).catch((error) => {
          throw error;
        });
      });
      res.status(201).json({ message: messages.success("U") });
    } else {
      res.status(400).json({ message: messages.failed("U") });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete tracks list */
const deleteChartsList = async (req, res) => {
  try {
    const length = await chartsModel.count();
    if (length) {
      chartsModel
        .deleteMany()
        .then(() => {
          res.status(201).json({ message: messages.success("D") });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({ message: messages.failed("D") });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete tracks list */
const deleteTracksList = async (req, res) => {
  try {
    const playlist_id = req.params.playlist_id;
    const length = await TracksModel.count({ id: playlist_id });
    if (length) {
      TracksModel.deleteMany({ id: playlist_id })
        .then(() => {
          res.status(201).json({ message: messages.success("D") });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({ message: messages.failed("D") });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChartsList,
  createTracksList,
  readChartsList,
  readTracksList,
  updateChartsList,
  updateTracksList,
  deleteChartsList,
  deleteTracksList,
};
