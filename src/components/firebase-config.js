/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyDwN-ZvPN9L6pQ3uKlwt7sSbomUxYe5fhs",
  authDomain: "youanme-c0fe9.firebaseapp.com",
  projectId: "youanme-c0fe9",
  storageBucket: "youanme-c0fe9.appspot.com",
  messagingSenderId: "188028416229",
  appId: "1:188028416229:web:52ed0fcdf7217639fd240c",
  measurementId: "G-HHYXNS71Q8"
};
const app = initializeApp(firebaseConfig)
//export const db = getDatabase(app);
const db = getDatabase(app)
const auth = getAuth(app)
const fire = getFirestore(app)
const storage = getStorage(app)
export { db, auth, fire, storage }
