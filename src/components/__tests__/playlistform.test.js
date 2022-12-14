import reducer from '../../redux/reducers/reducer';
import * as types from '../../redux/constants/actiontypes';

describe('playlist form reducer', () => {
  it('should return initial state');
  expect(reducer(undefined, {})).toEqual([
    {
      authUri: '',
      userId: '',
      playlistId: '',
      query: '',
      searchResults: [],
      trackUris: [],
      playlistName: '',
      description: '',
      privacy: false,
      genre: '',
      numSongs: '',
      finalSliderValue: [],
      offset: '',
      snapShotId: '',
      playlistUrl: '',
      alertMessage: '',
      variant: '',
      success: false,
      active: false,
      code: '',
      authMessage: '',
      promiseError: false,
      isLoading: false,
    },
  ]);
});
