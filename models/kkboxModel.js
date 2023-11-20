const mongoose = require("mongoose");
const axios = require("axios");

const oauth2Schema = new mongoose.Schema({
  access_token: { type: String, require: true },
  token_type: { type: String, require: true },
  expires_in: { type: Number, require: true },
  last_timestamp: { type: Number, require: true },
});

const chartsSchema = require("../schemas/chartsSchema");
const tracksSchema = require("../schemas/tracksSchema");

const oauth2Model = mongoose.model("kkboxOauth2", oauth2Schema);
const chartsModel = mongoose.model("kkboxCharts", chartsSchema);
const tracksModel = mongoose.model("kkboxTracks", tracksSchema);

const getChartsModel = () => {
  return chartsModel;
};
const getTracksModel = () => {
  return tracksModel;
};

const getMessages = () => {
  return messages;
};

/* Create token data */
const createToken = async () => {
  try {
    // Get kkbox access token
    const endpoint = "https://account.kkbox.com/oauth2/token";
    const formatData = {
      grant_type: "client_credentials",
      client_id: process.env.KK_ID,
      client_secret: process.env.KK_SECRET,
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const { data } = await axios.post(endpoint, formatData, { headers });
    const token = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      last_timestamp: Math.floor(new Date().getTime() / 1000),
    };
    // Save kkbox access token
    const length = await oauth2Model.count();
    if (length) await oauth2Model.deleteMany();
    const new_oauth2 = new oauth2Model(token);

    return await new_oauth2.save();
  } catch (error) {
    throw error;
  }
};
/* Get token data */
const getToken = async () => {
  try {
    const oauth2Data = await oauth2Model.findOne();
    const expires_in = Boolean(oauth2Data) ? oauth2Data.expires_in : 0;
    const last_timestamp = Boolean(oauth2Data) ? oauth2Data.last_timestamp : 0;
    // Elapsed time = current timestamp - last timestamp
    const current_timestamp = Math.floor(new Date().getTime() / 1000);
    const elapsedTime = current_timestamp - last_timestamp;
    const new_expire_in = expires_in - elapsedTime;
    if (new_expire_in <= 0) return await createToken();
    const updateData = {
      expires_in: new_expire_in,
      last_timestamp: current_timestamp,
    };
    return await oauth2Model.findOneAndUpdate({}, updateData);
  } catch (error) {
    throw error;
  }
};

/* Get charts data */
const getChartsData = async () => {
  try {
    // Get charts list
    const oauth2Data = await getToken();
    const access_token = oauth2Data.access_token;
    const token_type = oauth2Data.token_type;
    const endpoint = "https://api.kkbox.com/v1.1/charts?territory=TW";
    const headers = {
      accept: "application/json",
      authorization: `${token_type} ${access_token}`,
    };
    const response = await axios.get(endpoint, { headers });
    const chartsData = response.data.data;
    const chartsList = chartsData.map((item, index) => {
      let images = item.images;
      let cover = Boolean(images[0]) ? images[0].url : "";
      return {
        id: item.id,
        chartNo: index + 1,
        title: item.title,
        cover: cover,
      };
    });
    return chartsList;
  } catch (error) {
    throw error;
  }
};

/* Get tracks data */
const getTracksData = async (playlist_id) => {
  // Get tracks of specific charts playlist
  try {
    const oauth2Data = await getToken();
    const access_token = oauth2Data.access_token;
    const token_type = oauth2Data.token_type;
    const endpoint = `https://api.kkbox.com/v1.1/charts/${playlist_id}/tracks?territory=TW&limit=50`;
    const headers = {
      accept: "application/json",
      authorization: `${token_type} ${access_token}`,
    };
    const response = await axios.get(endpoint, { headers });
    const tracksData = response.data.data;
    const tracksList = tracksData.map((item, index) => {
      let images = item.album.images;
      let cover = Boolean(images[0]) ? images[0].url : "";
      return {
        id: playlist_id,
        track_id: item.id,
        rankNo: index + 1,
        title: item.name,
        album: item.album.name,
        artist: item.album.artist.name,
        titleLink: item.url,
        albumLink: item.album.url,
        artistLink: item.album.artist.url,
        cover: cover,
        release_date: item.album.release_date,
      };
    });

    return tracksList;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getChartsModel,
  getTracksModel,
  getMessages,
  getChartsData,
  getTracksData,
};
