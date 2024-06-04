import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getDatabase } from '@firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD641H00IEiQXmYbcZNHFK7-U40qgAAsk0",
  authDomain: "bancodedados-420512.firebaseapp.com",
  databaseURL: "https://bancodedados-420512-default-rtdb.firebaseio.com",
  projectId: "bancodedados-420512",
  storageBucket: "bancodedados-420512.appspot.com",
  messagingSenderId: "507061800282",
  appId: "1:507061800282:web:df3b0dfff2a194ba217763",
  measurementId: "G-8XD7TR78PJ"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const database = getDatabase(firebaseApp);

export { firebaseApp, storage, database };