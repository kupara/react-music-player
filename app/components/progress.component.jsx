import React from 'react';

export default class Progress extends React.Component {

  render() {
    return(
      <div className="progress">
        <span className="player-time-elapsed">{this.props.elapsed}</span>
        <progress
         value={this.props.position}
         max="1"></progress>
       <span className="player-time-total">{this.props.total}</span>
      </div>
    )
  }

}
