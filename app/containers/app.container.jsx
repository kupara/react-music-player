import React from 'react';
import Axios from 'axios';

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.client_id = '5e58a775db42c69d7d28a21ca3beb255';
    this.state = {
      track: {
        stream_url: '',
        title: '',
        artwork_url: ''
      }
    }
  }

  componentDidMount() {
    this.randomTrack();
  }

  randomTrack() {
    let self = this;
    Axios
      .get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}`)
      .then(function(response) {
        const tracksLength = response.data.tracks.length;
        const randomNumber = Math.floor(Math.random() * tracksLength + 1);
        self.setState({
          track: response.data.tracks[randomNumber];
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  render() {
    return (
      <div className="music-player">

      </div>
    );
  }
}
