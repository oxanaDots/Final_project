// functions/firebase.js
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

initializeApp(); // ✅ Make sure this is only called once

const db = getFirestore();
const auth = getAuth();


export { db, auth};
