let userToken = '';
let expiresIn = '';
const clientID = '3f19930ed1354091926d98e6dc458415';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
	getAccessToken() {
		if(userToken) {
			return userToken;
		} else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
			userToken = window.location.href.match(/access_token=([^&]*)/)[1];
			expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

			window.setTimeout(() => userToken = '', expiresIn*1000);
			window.history.pushState('Access Token', null, '/');

			return userToken;
		} else {
				window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
		}
	}

	, search: (term) => {
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
				headers: {
					Authorization: `Bearer ${userToken}`
				}
		}).then( response => {
			return response.json();
		}).then( jsonResponse => {
			if (jsonResponse.searchResults) {
				return jsonResponse.searchResults.map(track => ({
					id: track.id
					, name: track.name
					, artist: track.artists[0].name
					, album: track.album.name
					, uri: track.uri
				}));
			}
		});
	}

	, savePlaylist: (playlistName, trackURIs) => {
		const accessToken = Spotify.getAccessToken();
		let userID = '';
		let playlistID ='';

		if (!playlistName || !trackURIs) {
			return;
		}

		return fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authoriation: `Bearer ${accessToken}`
			}
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			userID = jsonResponse.id;

			return fetch(`/v1/users/${userID}/playlists`, {
				method: 'POST'
				, headers: {
						Authorization: `Bearer ${accessToken}`
				}
				, body: JSON.stringify({
						name: playlistName
					})
			}).then( response => {
				return response.json();
			}).then( jsonResponse => {
				playlistID = jsonResponse.id;

				return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
					method: 'POST'
					, headers: {
						Authorization: `Bearer ${accessToken}`
					}
					, body: JSON.stringify({
						uris: trackURIs
					})
				}).then(response => {
					return response.json();
				}).then(jsonResponse => {
					playlistID = jsonResponse.id;
				});
			});
		});
	}
};

export default Spotify;