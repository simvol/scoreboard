import { FETCH_ALL_PLAYERS } from '../actions/types';

const playersReducer = (state = null, action) => {
  switch(action.type) {
    case FETCH_ALL_PLAYERS:
      return action.payload;

    default:
      return state;
  }
}

export default playersReducer;