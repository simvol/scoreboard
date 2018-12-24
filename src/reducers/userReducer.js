import { FETCH_USER } from '../actions/types';

const userReducer = (state = null, action) => {
  switch(action.type) {
    case FETCH_USER:
      return action.payload;

    default:
      return state;
  }
};

export default userReducer;