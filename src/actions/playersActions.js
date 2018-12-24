import {
  FETCH_ALL_PLAYERS,
  ALL_PLAYERS_LOADING,
  SETTING_ACTIVE_PLAYER,
  ADD_PLAYER_SCORE,
  UPDATE_PLAYER_ON_GAME_FINISH } from './types';
import { firestore, playersRef } from '../config/firebase';
import { NotificationManager } from 'react-notifications';

// Getting all players and setting a listener for changes
export const fetchAllPlayers = () => async (dispatch, getState) => {
  dispatch({ type: ALL_PLAYERS_LOADING, payload: true });

  const uid = getState().user.email;

  playersRef
    .where('adminId', '==', uid)
    .get()
    .then(playersSnapshot => {
      const players = playersSnapshot.docs.map(doc => doc.data());

      dispatch({ type: ALL_PLAYERS_LOADING, payload: false });
      dispatch({ type: FETCH_ALL_PLAYERS, payload: players });
    });
  
}

export const updatePlayers = players => async (dispatch, getState) => {
  dispatch({ type: ALL_PLAYERS_LOADING, payload: true });

  const uid = getState().user.email;
  const batch = firestore.batch();

  playersRef
    .where('adminId', '==', uid)
    .get()
    .then(playersSnapshot => {
      const existingPlayers = playersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Prepare updates
      players.map(player => {
        const exPlayer = existingPlayers.filter(exPlayer => exPlayer.name.toLowerCase() === player.name.toLowerCase())[0];
        const updateReference = exPlayer
          ? playersRef.doc(exPlayer.id)
          : playersRef.doc(); // ref.doc() does not write to network or disc, just generates id

        const updatedPlayer = {
          name: player.name,
          adminId: player.adminId,
          gamesPlayed: exPlayer && exPlayer.gamesPlayed ? ++exPlayer.gamesPlayed : 1,
          gamesWon: exPlayer && exPlayer.gamesWon
            ? (player.isWinner ? ++exPlayer.gamesWon : exPlayer.gamesWon)
            : (player.isWinner ? 1 : 0),
        };

        batch.set(updateReference, updatedPlayer);
      });

      // Commit updates
      batch
        .commit()
        .then(() => {
          dispatch({ type: ALL_PLAYERS_LOADING, payload: false });
        });
  });
}