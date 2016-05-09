import React from 'react';
import Axios from 'axios';
import Sound from 'react-sound';

import Search from '../components/search.component.jsx';
import Details from '../components/details.component.jsx';
import Player from '../components/player.component.jsx';
import Progress from '../components/progress.component.jsx';
import Footer from '../components/footer.component.jsx';

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.client_id = '5e58a775db42c69d7d28a21ca3beb255';
    this.state = {
      track: {
        stream_url: '',
        title: '',
        artwork_url: ''
      },
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: []
    }
  }

  componentDidMount() {
    this.randomTrack();
  }

  randomTrack() {
    let self = this;
    Axios
      .get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}`)
      .then(function(res) {
        const tracksLength = res.data.tracks.length;
        const randomNumber = Math.floor(Math.random() * tracksLength + 1);
        self.setState({
          track: res.data.tracks[randomNumber];
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  prepareUrl(url) {
    return `${url}?client_id=${this.client_id}`
  }

  handleSongPlaying(audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    });
  }

  formatMilliseconds(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;

    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;

    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);

    return (minutes < 10 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds;
  }

  handleSongFinished() {
    this.randomTrack();
  }

  handleSelect(value, item) {
    this.setState({
      autoCompleteValue: value,
      track: item
    });
  }

  handleChange(event, value) {
    this.setState({
      autoCompleteValue: event.target.value
    });
    let self = this;

    Axios
      .get(`https://api.soundcloud.com/playlists/209262931?client_id=${this.client_id}&q=${value}`)
      .then(function() {
        self.setState({
          tracks: response.data
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  togglePlay() {
    if(this.state.playStatus === Sound.status.PLAYING){
      this.setState({playStatus: Sound.status.PAUSED})
    } else {
      this.setState({playStatus: Sound.status.PLAYING})
    }
  }

  stop() {
    this.setState({
      playStatus: Sound.status.STOPPED
    });
  }

  forward() {
    this.setState({
      playFromPosition: this.playFromPosition += 10000
    });
  }

  rewind() {
    this.setState({
      playFromPosition: this.playFromPosition -= 10000
    });
  }

  xlArtwork(url){
    return url.replace(/large/, 't500x500');
  }

  render() {
    const appStyle = {
      width: '500px',
      height: '500px',
      backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.7)
    ),   url(${this.xlArtwork(this.state.track.artwork_url)})`
    }
    return (
      <div className="music-player" style={appStyle}>
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}
        />
        <Details
            title={this.state.track.title}
        />
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          rewind={this.rewind.bind(this)}
          random={this.randomTrack.bind(this)}
        />
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}
        />
        <Footer />
        <Sound
           url={this.prepareUrl(this.state.track.stream_url)}
           playStatus={this.state.playStatus}
           onPlaying={this.handleSongPlaying.bind(this)}
           playFromPosition={this.state.playFromPosition}
           onFinishedPlaying={this.handleSongFinished.bind(this)}
        />
      </div>
    );
  }
}
