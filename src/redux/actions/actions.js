import axios from 'axios';
import { randomCharacters } from '../../assets/RandomCharacters';
export const GET_URI = 'GET_URI';
export const HANDLE_TOKEN = 'HANDLE_TOKEN';
export const GET_USER_INFO = 'GET_USER_INFO';
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const RANDOMIZE_QUERY = 'RANDOMIZE_QUERY';
export const SEARCH_SONGS = 'SEARCH_SONGS';
export const GET_TRACK_URIS = 'GET_TRACK_URIS';
export const HANDLE_FORM_VALUES = 'HANDLE_FORM_VALUES';
export const HANDLE_SLIDER_VALUE = 'HANDLE_SLIDER_VALUE';
export const GET_SNAPSHOT_ID = 'GET_SNAPSHOT_ID';

// Step 1: Begin Authorization

export const handleAuthURI = () => (dispatch) => {
  return axios
    .get('http://localhost:2019/authorize')
    .then((res) => {
      dispatch({ type: GET_URI, payload: res.data });
      console.log('1');
    })
    .catch((err) => {
      console.log('Error occurred', err);
    });
};

// Step 3: Put Token in State
export const handleToken = () => (dispatch) => {
  return axios
    .get('http://localhost:2019/token')
    .then((res) => {
      dispatch({ type: HANDLE_TOKEN, payload: res.data });
      console.log('2');
    })
    .catch((err) => {
      console.log(err);
    });
};

// Step 4: Save User Info in State

export const handleUserInfo = () => (dispatch) => {
  return axios
    .get('http://localhost:2019/me')
    .then((res) => {
      dispatch({ type: GET_USER_INFO, payload: res.data.id });
      console.log('3');
    })
    .catch((err) => {
      console.log('Error occurred while retrieving profile information', err);
    });
};
export const handleFormValues = (data) => (dispatch) => {
  dispatch({ type: HANDLE_FORM_VALUES, payload: data });
  console.log('4');
  return data;
};

export const handleSliderValue = (data) => (dispatch) => {
  dispatch({ type: HANDLE_SLIDER_VALUE, payload: data });
  console.log('5');
  return data;
};
// Step 5: Create a New Playlist
export const handlePlaylistCreation = () => (dispatch, getState) => {
  let state = getState();
  const userId = state.userId;
  const playlistName = state.playlistName;
  const description = state.description;
  const privacy = state.privacy;
  const token = state.token;
  return axios
    .post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        description: description,
        public: privacy.toString(),
      },
      { headers: { Authorization: 'Bearer' + ' ' + token } }
    )
    .then((res) => {
      dispatch({ type: CREATE_PLAYLIST, payload: res.data.id });
      console.log('6');
    })
    .catch((err) => {
      console.log(err);
    });
};

// Step 6: Get Query Seed

export const randomizeQuery = () => (dispatch) => {
  var result = '';
  result =
    randomCharacters[Math.floor(Math.random() * randomCharacters.length)];
  dispatch({ type: RANDOMIZE_QUERY, payload: result });
  console.log('7');
  return result;
};

// Step 7: Search for songs
export const handleSearch = () => (dispatch, getState) => {
  let state = getState();
  const query = state.query;
  const genre = state.genre;
  const finalSliderValue = state.finalSliderValue;
  const numSongs = state.numSongs;
  const token = state.token;
  return axios
    .get(
      `https://api.spotify.com/v1/search?query=${query}*+genre%3A${genre}+year%3A+${finalSliderValue[0]}-${finalSliderValue[1]}&type=track&offset=0&limit=${numSongs}`,
      { headers: { Authorization: 'Bearer' + ' ' + token } }
    )
    .then((res) => {
      dispatch({ type: SEARCH_SONGS, payload: res.data.tracks.items });
      console.log('8');
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
};
// Step 8: Get URIs
export const handleTrackUris = () => (dispatch, getState) => {
  let state = getState();
  const searchResults = state.searchResults;
  let uriList = [...new Set(searchResults.map((song) => song.uri))];
  dispatch({ type: GET_TRACK_URIS, payload: uriList });
  console.log('9');
  return uriList;
};
// Step 9: Add Songs to playlist

export const addToPlaylist = () => (dispatch, getState) => {
  let state = getState();
  const playlistId = state.playlistId;
  const trackUris = state.trackUris;
  const token = state.token;
  return axios
    .post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: trackUris },
      { headers: { Authorization: 'Bearer' + ' ' + token } }
    )
    .then((res) => {
      console.log('Success adding to playlist!');
      dispatch({ type: GET_SNAPSHOT_ID, payload: res.snapshot_id });
      return res.snapshot_id;
    })
    .catch((err) => console.log(err));
};

export const generatePlaylists = (data) => (dispatch) => {
  dispatch(handleAuthURI())
    .then(() => {
      return dispatch(handleToken());
    })
    .then(() => {
      return dispatch(handleUserInfo());
    })
    .then(() => {
      return dispatch(handleFormValues(data.formValues));
    })
    .then(() => {
      return dispatch(handleSliderValue(data.sliderValue));
    })
    .then(() => {
      return dispatch(handlePlaylistCreation());
    })
    .then(() => {
      return dispatch(randomizeQuery());
    })
    .then(() => {
      return dispatch(handleSearch());
    })
    .then(() => {
      return dispatch(handleTrackUris());
    })
    .then(() => {
      return dispatch(addToPlaylist());
    });
};
