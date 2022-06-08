// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase-firestore-lite';

import "firebase/firestore"
import "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAD5GQ5ic_EtQCpVs6Hxnp8Ft2Qf3ODQF4",
  authDomain: "splitapp-20ec1.firebaseapp.com",
  projectId: "splitapp-20ec1",
  storageBucket: "splitapp-20ec1.appspot.com",
  messagingSenderId: "678033813527",
  appId: "1:678033813527:web:66483c9bc868dde211ac52",
  measurementId: "G-4ZFD0SX7KS"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
// const db = getFirestore(app);
const auth = app.auth();
// async function getUsers(db) {
//   const usersCol = collection(db, 'users');
//   const userSnapshot = await getDocs(usersCol);
//   const userList = userSnapshot.docs.map(doc => doc.data());
//   return userList;
// }
// console.log(getUsers(db));

export { db, auth }