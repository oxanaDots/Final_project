
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

initializeApp(); 

const db = getFirestore();
const auth = getAuth();


export { db, auth};
