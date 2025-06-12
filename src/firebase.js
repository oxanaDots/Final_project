// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ16iAzjDqygDWeaCgkVGJDYm7lmhxlT0",
  authDomain: "art-hosting.firebaseapp.com",
  projectId: "art-hosting",
  storageBucket: "art-hosting.firebasestorage.app",
  messagingSenderId: "542333465192",
  appId: "1:542333465192:web:131dff688b34ca79abc1dd",
  measurementId: "G-P1H09YHTXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)