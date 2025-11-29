// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvWDOlDndFdLfk3xAHKoTpEzi-Q1mxpZw",
  authDomain: "weddingchecklist-2d238.firebaseapp.com",
  projectId: "weddingchecklist-2d238",
  storageBucket: "weddingchecklist-2d238.firebasestorage.app",
  messagingSenderId: "527901396660",
  appId: "1:527901396660:web:0c22af2078f757140c51e1",
  measurementId: "G-9KK4BHCEZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);