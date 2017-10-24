import React, { Component } from 'react';
import './App.css';
import { Spotify } from '../../util/Spotify';
import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';


class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        searchResults: [],
        playlistName: 'My Playlist',
        playlistTracks: []
      }
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
    }

    addTrack(track) {
      if (!this.state.playlistTracks.includes(track.id)) {
        let updatedPlaylist = this.state.playlistTracks.concat(track);
        this.setState({ playlistTracks: updatedPlaylist });
      }
    }

    removeTrack(track) {
    if (this.state.playlistTracks.includes(track.id)) {
      let currentPlaylist = this.state.playlistTracks;
      this.setState({ playlistTracks: currentPlaylist.filter(checkTrack => checkTrack.id !== track.id) });
    }
  }

    updatePlaylistName(name) {
      this.setState({ playlistName: name });
    }

    savePlaylist() {
      const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
      Spotify.savePlaylist(this.state.playlistName,trackUris);
      this.setState({
        searchResults: [],
        playlistName: 'New Playlist'
      });

    }

    search(term) {

      Spotify.search(term).then(
          trackResults => {
            this.setState({
            searchResults: trackResults
          })
        });
    }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
          <SearchBar
            onSearch={ this.search }
            />
            <div className="App-playlist">
              <SearchResults
                searchResults={ this.state.searchResults }
                onAdd={this.addTrack}
                onRemove={this.removeTrack}
                />
              <Playlist
                playlistName={ this.state.playlistName }
                playlistTracks={ this.state.playlistTracks }
                onNameChange={ this.updatePlaylistName }
                onSave={ this.savePlaylist }
                onAdd={this.addTrack}
                onRemove={this.removeTrack}
                />
            </div>
          </div>
        </div>
    );
  }
}

export default App;
