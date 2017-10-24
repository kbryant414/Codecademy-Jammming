const clientId = '0ba9add0eb8346519dc74a59b78e807e';
const redirectUri = 'http://kbryant414.surge.sh/';
const redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
let accessToken;
let expiresIn;

export const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      const scope = 'user-read-private playlist-modify-public';
      const redirectUrl = ''
      window.location = redirectUrl
    }
  },

  search(term) {
    if (!accessToken) { Spotify.getAccessToken(); }
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`;

    return fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(
      response => response.json()
    ).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
      }))
    });
  },

  savePlaylist(playlistName,playlistUris) {
    if (!playlistName || !playlistUris || playlistUris.length === 0) {
      return
    } else {
      const userUrl = 'https://api.spotify.com/v1/me';
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      let userId;

      return fetch(userUrl, {
        headers: headers
      }).then(
        response => response.json()
      ).then(
        jsonResponse => {
        userId = jsonResponse.id;
        const playlistsUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
        return fetch(playlistsUrl, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({
            name: playlistName
          })
        }).then(
          response => response.json()
        ).then(
          jsonResponse => jsonResponse.id
        ).then(
          playlistId => {
            console.log("Spotify.playlistId: " + playlistId);
            const playlistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
            return fetch(playlistTracksUrl,{
              headers: headers,
              method: 'POST',
              body: JSON.stringify({
                uris: playlistUris
              })
            });
          });
      });
    }}};
