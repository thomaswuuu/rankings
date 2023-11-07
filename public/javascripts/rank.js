/* Initailize to fetch each platform charts data */
const spinner = document.querySelector("#spinner");
const platforms = document.querySelector("#platforms");
const charts = document.querySelector("#charts");
const tracks = document.querySelector("#tracks");
const previewKKBOX = document.querySelector("#previewKKBOX");
const previewSpotify = document.querySelector("#previewSpotify");
const kkboxes = document.querySelectorAll(".kkbox");
const spotifies = document.querySelectorAll(".spotify");
let previewSpotifyController; // spotify preview controller

const closePreview = () => {
  previewKKBOX.setAttribute("src", "");
  previewSpotify.querySelector("iframe").setAttribute("src", "");
};

const queryPreview = (e) => {
  const previewTitle = document.querySelector(".modal-title");
  const trackInfo = e.parentNode;
  const title = trackInfo.querySelector(".title a").innerText;
  const artist = trackInfo.querySelector(".artist").innerText;
  const id = e.dataset.id;
  const type = e.dataset.type;
  let widget_source = "";
  previewTitle.style.width = "100%";
  previewTitle.innerHTML = `${artist} - ${title} `;
  if (type == "KKBOX") {
    widget_source = `https://widget.kkbox.com/v1/?id=${id}&autoplay=true&type=song&terr=TW&lang=TC&loop=false`;
    previewKKBOX.style.display = "block";
    previewSpotify.style.display = "none";
    previewKKBOX.setAttribute("height", "100px");
    previewKKBOX.setAttribute("src", widget_source);
  } else {
    previewKKBOX.style.display = "none";
    previewSpotify.style.display = "block";
    // Change iframe src content and play tracks
    previewSpotifyController.loadUri(`spotify:track:${id}`);
    previewSpotifyController.play();
  }

  // Add event of close button
  const previewClose = document.querySelector("#previewClose");
  previewClose.addEventListener("click", () => {
    closePreview();
  });
  const previewModal = document.querySelector("#previewModal");
  previewModal.addEventListener("click", () => {
    closePreview();
  });
};

const queryTracks = (e) => {
  // Get tracks data
  const type = e.dataset.type;
  const playlist_id = e.dataset.id;
  const chartCover = e.childNodes[1].src;
  const chartTitle = e.childNodes[3].innerText;
  const borderStyle = type == "KKBOX" ? "kkbox-border" : "spotify-border";
  const hub = new MusicsHub(type, playlist_id);
  const tracksData = hub.data;

  spinner.style.display = "flex";
  platforms.style.display = "none";
  charts.style.display = "none";
  tracks.style.display = "none";

  tracksData.then((data) => {
    if (data.length) {
      tracks.innerHTML = `<h4>
                            <img src="${chartCover}"/>
                            <span>${type} ${chartTitle}</span>
                          </h4>`;
      data.forEach((track) => {
        let id = track.track_id;
        let rankNo = track.rankNo;
        let title = track.title;
        let album = track.album;
        let artist = track.artist;
        let titleLink = track.titleLink;
        let albumLink = track.albumLink;
        let artistLink = track.artistLink;
        let cover = track.cover;
        let release_date = track.release_date;
        tracks.innerHTML += `<div class="track-box ${borderStyle} fade-in">
                              <p>${rankNo}</p>
                              <img src=${cover} />
                              <div class="title">
                                <a href="${titleLink}" target="_blank">${title}</a>
                                <div class="artist">
                                  <a href="${artistLink}" target="_blank">${artist}</a>
                                </div>
                              </div>
                              <div class="album">
                                <a href="${albumLink}" target="_blank">${album}</a>
                              </div>
                              <div class="date">${release_date}</div>
                              <div class="preview"
                                    data-bs-toggle="modal"
                                    data-type="${type}" data-id="${id}"
                                    data-bs-target="#previewModal">
                                試聽
                              </div>
                            </div>`;
      });
      tracks.innerHTML += `<p class="back">返回排行榜列表</p>`;
      // Add click event of preview and back
      const previews = document.querySelectorAll(".preview");
      previews.forEach((preview) => {
        preview.addEventListener("click", () => {
          queryPreview(preview);
        });
      });
      // Add click event to back text click
      const back = document.querySelector(".back");
      back.addEventListener("click", () => {
        charts.style.display = "flex";
        tracks.style.display = "none";
        back.style.display = "none";
        window.location.href = "#charts";
      });
      // display tracks results
      spinner.style.display = "none";
      tracks.style.display = "flex";
    }
  });
};

const queryCharts = (e) => {
  // Get charts data
  const type = e.dataset.type;
  const hub = new MusicsHub(type, null);
  const chartsData = hub.data;
  const navbar = document.querySelector("#collapsibleNavbar");
  const borderStyle = type == "KKBOX" ? "kkbox-border" : "spotify-border";
  navbar.classList.remove("show");
  // Disable all display items
  spinner.style.display = "flex";
  platforms.style.display = "none";
  charts.style.display = "none";
  tracks.style.display = "none";
  chartsData
    .then((data) => {
      if (data.length) {
        charts.innerHTML = `<h4>
                              <span>${type} 排行榜列表</span>
                            </h4>`;
        data.forEach((chart) => {
          let title = chart.title;
          charts.innerHTML += `<div class="chart-box ${borderStyle} fade-in"
                                data-type="${type}"
                                data-id="${chart.id}">
                                <img src="${chart.cover}" />
                                <p>${title}</p>
                              </div>`;
        });
        // Add click event of chart-box
        const chartBoxes = document.querySelectorAll(".chart-box");
        chartBoxes.forEach((chartBox) => {
          chartBox.addEventListener("click", () => {
            queryTracks(chartBox);
          });
        });
        // Display charts list
        spinner.style.display = "none";
        charts.style.display = "flex";
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Add click event to all kkbox and spotify classes
kkboxes.forEach((kkbox) => {
  kkbox.addEventListener("click", () => {
    queryCharts(kkbox);
  });
});

spotifies.forEach((spotify) => {
  spotify.addEventListener("click", () => {
    queryCharts(spotify);
  });
});

// For spotify iframe autoplay
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById("embed-iframe");
  const options = {
    width: "100%",
    height: "180",
  };
  const callback = (EmbedController) => {
    previewSpotifyController = EmbedController;
  };
  IFrameAPI.createController(element, options, callback);
};

// Header scroll down to hide
let prevScrollpos = window.scrollY;
window.addEventListener("scroll", () => {
  let currentScrollPos = window.scrollY;
  let header = document.querySelector("header");
  if (prevScrollpos >= currentScrollPos || currentScrollPos <= 20) {
    header.style.top = "0";
  } else {
    header.style.top = "-20vh";
  }
  prevScrollpos = currentScrollPos;
});
