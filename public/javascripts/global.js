class MusicsHub {
  /* 
    Initial properties：
    - platform: kkbox, spotify, youtube, or apple
    - playlsit_id:
      - null: get charts list of platform
      - otherwise: get specific playlsit tracks of platform
  */
  constructor(platform, playlsit_id) {
    this.platform = platform;
    this.playlsit_id = playlsit_id;
    this.endpoint = playlsit_id
      ? `/api/${this.platform}/charts/${this.playlsit_id}/tracks`
      : `/api/${this.platform}/charts`;
  }

  get data() {
    return this.getData(this.endpoint);
  }

  getData(endpoint) {
    return fetch(endpoint)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }
}
