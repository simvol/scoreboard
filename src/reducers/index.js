import { combineReducers } from 'redux';
import gameReducer from './gameReducer';
import loadingReducer from './loadingReducer';
import userReducer from './userReducer';
import playersReducer from './playersReducer';

const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer,
  loading: loadingReducer,
  players: playersReducer
});

export default rootReducer;