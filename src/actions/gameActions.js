import { FETCH_CURRENT_GAME, GAME_LOADING } from './types';
import { gamesRef, playersRef, firestore } from '../config/firebase';

export const fetchCurrentGame = () => async (dispatch, getState) => {
  dispatch({ type: GAME_LOADING, payload: true });

  const uid = getState().user.email;

  // Get all games with current user id and no winner
  // If there is a game - return game and start listening to the changes
  // otherwise return null
  gamesRef
    .where('adminId', '==', uid)
    .where('winner', '==', null)
    .get()
    .then(gamesSnapshot => {
      const id = gamesSnapshot && gamesSnapshot.docs && gamesSnapshot.docs[0]
        ? gamesSnapshot.docs[0].id
        : null;

      if (id){ 
        return gamesRef.doc(id);
      } else {
        dispatch({ type: GAME_LOADING, payload: false });
        dispatch({ type: FETCH_CURRENT_GAME, payload: null });
      }
    })
    .then(gameRef => {
      if (!gameRef) return; 

      // Start listening to the game
      gameRef.onSnapshot(gameSnapshot => {
        const game = { ...gameSnapshot.data(), id: gameSnapshot.id };

        dispatch({ type: GAME_LOADING, payload: false });
        dispatch({ type: FETCH_CURRENT_GAME, payload: game });
      })
    });
}

// Every game may have existing users as well as new users that we need to create before creating a game
export const createNewGame = newGame => async (dispatch, getState) => {
  dispatch({ type: GAME_LOADING, payload: true });

  gamesRef
    .add(newGame)
    .then(gameRef => {

      // Start listening to the game
      gameRef.onSnapshot(gameSnapshot => {
        const game = { ...gameSnapshot.data(), id: gameSnapshot.id };

        dispatch({ type: GAME_LOADING, payload: false });
        dispatch({ type: FETCH_CURRENT_GAME, payload: game });
      })
    });

}

export const updateGame = game => async dispatch => {
  dispatch({ type: GAME_LOADING, payload: true });

  gamesRef
    .doc(game.id)
    .set(game)
    .then(() => {
        dispatch({ type: GAME_LOADING, payload: false });
    });
}


// TODO
// - implement game finish: update game, update players (create new ones)
// - implement undo thing
// - figure out how to not mutate game and users
// - fix scoreboard tab?