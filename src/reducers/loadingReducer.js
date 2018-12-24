import { GAME_LOADING, USER_LOADING, ALL_PLAYERS_LOADING } from '../actions/types';

const gameReducer = (state = {}, action) => {
  switch(action.type) {
    case GAME_LOADING:
      return { ...state, game: action.payload };

    case USER_LOADING:
      return { ...state, user: action.payload };

    case ALL_PLAYERS_LOADING:
      return { ...state, allPlayers: action.payload };

    default: return state;
  }
}

export default gameReducer;