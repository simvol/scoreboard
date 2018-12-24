import { FETCH_CURRENT_GAME } from '../actions/types';

// const initialState = {
//   game: {
//     loading: true,
//     data: null
//   }
// }

const gameReducer = (state = null, action) => {
  switch(action.type) {
    case FETCH_CURRENT_GAME:
      return action.payload;

    default:
      return state;
  }
}

export default gameReducer;