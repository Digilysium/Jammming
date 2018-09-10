import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);

		this.state = {
			searchResults: []
			, trackURIs: []
		};
	}

	addTrack(track) {
		if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
			return;
		}
	}

	removeTrack(track) {
		this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)
	}

	updatePlaylistName(name) {
		this.setState( this.playListName = name);
	}

	savePlaylist(){
		trackURIs = this.props.playlistTracks;
	}

	search(searchTerm){
		Spotify.search(searchTerm).then(searchResults => {
			this.setState({searchResults: searchResults});
		});
	}

	render() {
		return (
			<div>
				<h1>Ja<span class="highlight">mmm</span>ing</h1>
				<div class="App">
					<SearchBar onSearch={this.search} />
					<div class="App-playlist">
					<SearchResults searchResults={this.searchResults} onAdd={this.addTrack} />
					<Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
				</div>
			</div>
		</div>
		);
	}
}

export default App;
