/* Initailize to fetch each platform charts data */
const spinner = document.querySelector("#spinner");
const platforms = document.querySelector("#platforms");
const charts = document.querySelector("#charts");
const tracks = document.querySelector("#tracks");
const kkboxes = document.querySelectorAll(".kkbox");

const queryTracks = (e) => {
  // Get tracks data
  const type = e.dataset.type;
  const playlist_id = e.dataset.id;
  const chartCover = e.childNodes[1].src;
  const chartTitle = e.childNodes[3].innerText;
  const hub = new MusicsHub(type, playlist_id);
  const tracksData = hub.data;
  spinner.style.display = "flex";
  platforms.style.display = "none";
  charts.style.display = "none";
  tracks.style.display = "none";

  tracksData.then((data) => {
    if (data.length) {
      tracks.innerHTML = `<h4 style="display:flex">
                            <img src="${chartCover}" style="width:80px"/>
                            <span>${chartTitle}</span>
                          </h4>`;
      tracks.innerHTML += `<table></table>`;
      data.forEach((track) => {
        let id = track.track_id;
        let rankNo = track.rankNo;
        let title = track.title;
        let album = track.album;
        let artist = track.artist;
        let link = track.link;
        let cover = track.cover;
        let release_date = track.release_date;

        tracks.innerHTML += ``;
      });
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

  spinner.style.display = "flex";
  platforms.style.display = "none";
  charts.style.display = "none";
  tracks.style.display = "none";
  chartsData
    .then((data) => {
      if (data.length) {
        charts.innerHTML = `<h4><i class="fa-brands fa-kickstarter fa-3x"></i>
                              <span>${type} 排行榜列表</span>
                            </h4>`;
        data.forEach((chart) => {
          let title = chart.title;
          charts.innerHTML += `<div class="chart-box"  
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

// Add click event to all kkbox classes
kkboxes.forEach((kkbox) => {
  kkbox.addEventListener("click", () => {
    queryCharts(kkbox);
  });
});
