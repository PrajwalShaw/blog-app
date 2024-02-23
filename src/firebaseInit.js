// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore}  from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRs1nD3Td6Daxo-adjDexxuyLRre83Kek",
  authDomain: "blogging-app-2a68e.firebaseapp.com",
  projectId: "blogging-app-2a68e",
  storageBucket: "blogging-app-2a68e.appspot.com",
  messagingSenderId: "282399550695",
  appId: "1:282399550695:web:4ed8b9946447c53cb7c642",
  measurementId: "G-H0S4DV2N8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);