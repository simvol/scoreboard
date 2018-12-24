import * as firebase from 'firebase';
import { FirebaseConfig } from './keys';

const app = firebase.initializeApp(FirebaseConfig);

export const firestore = firebase.firestore(app);

firestore.settings({ timestampsInSnapshots: true });

export const gamesRef = firestore.collection('games');
export const playersRef = firestore.collection('players');
export const firebaseAuth = firebase.auth();