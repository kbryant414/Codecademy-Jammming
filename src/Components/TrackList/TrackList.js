import React, { Component } from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends React.Component {
  render() {

    const tracks = this.props.tracks.map(track =>
    <Track
      key={ track.id }
      track={ track }
      onAdd={ this.props.onAdd }
      onRemove={ this.props.onRemove }
      />);

    return (
      <div className="TrackList">
        {tracks}
      </div>
    )
  }
};
