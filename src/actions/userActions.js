import { FETCH_USER, USER_LOADING } from './types';
import { firebaseAuth } from '../config/firebase';
import { NotificationManager } from 'react-notifications';

export const fetchUser = () => async dispatch => {
  dispatch({ type: USER_LOADING, payload: true });
  
  firebaseAuth.onAuthStateChanged(user => {
    dispatch({ type: USER_LOADING, payload: false });
    dispatch({ type: FETCH_USER, payload: user });
  })
}

export const login = (email, password) => async dispatch => {
  firebaseAuth.signInWithEmailAndPassword(email, password)
    .then(res => {
    })
    .catch(err => {
      NotificationManager.error(err.message);
    });
}

export const logout = () => async dispatch => {
  firebaseAuth.signOut();
}

export const createAccount = (email, password) => async dispatch => {
  firebaseAuth.createUserWithEmailAndPassword(email, password);
}