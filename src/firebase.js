import firebase from 'firebase';

let config = {
  apiKey: 'AIzaSyBHZhiKz8MDP-Rmc0VXzdureDfOKWXGh_s',
  authDomain: 'chore-tracker-cdb66.firebaseapp.com',
  databaseURL: 'https://chore-tracker-cdb66.firebaseio.com',
  projectId: 'chore-tracker-cdb66',
  storageBucket: 'chore-tracker-cdb66.appspot.com',
  messagingSenderId: '244552897910',
};

export const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.database();
export const auth = firebaseApp.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const storageKey = 'chore-tracker-regnipelk';

export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
};
