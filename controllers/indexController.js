const kkboxModels = require("../models/kkboxModel");
const kkboxCharts = kkboxModels.getChartsModel();
// const spotifyCharts = spotifyModels.getChartsModel();
// const youtubeCharts = youtubeModels.getChartsModel();
// const appleCharts = appleModels.getChartsModel();

const getAllChartsList = async (req, res) => {
  try {
    const KCharts = await kkboxCharts
      .find({ chartNo: { $lt: 8 } })
      .sort({ chartNo: 1 })
      .exec();
    const chartsList = {
      kkbox: [],
      spotify: [],
      youtube: [],
      apple: [],
    };
    /* KKBOX */
    KCharts.forEach((chart) => {
      chartsList.kkbox.push({
        id: chart.id,
        title: chart.title,
        cover: chart.cover,
      });
    });
    /* Spotify */

    /* Youtube */

    /* Apple */
    // console.log(chartsList);
    res.render("index", { chartsList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllChartsList };
