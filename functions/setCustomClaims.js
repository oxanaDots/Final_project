
import * as functions from 'firebase-functions';
import { auth, db } from './firebase.js'
import { getDatabase } from 'firebase-admin/database';
export const processSignUp = functions.auth.user().onCreate(async (user) => {

  const enterpriseDoc = await db.collection('businesses').doc( user.uid).get()
    const artistDoc = await db.collection('artists').doc( user.uid).get()


    try {
 let customClaims={}

     if (user.email && enterpriseDoc.exists && enterpriseDoc.data().role === 'business') {
     customClaims = {
      business: true,
      }
    } 
     if (user.email && artistDoc.exists && artistDoc.data().role === 'artist') {
     customClaims = {
      artist: true,
      
    }}
      // Set custom user claims on this newly created user.
      await auth.setCustomUserClaims(user.uid, customClaims);

      // Update real-time database to notify client to force refresh.
      const metadataRef = getDatabase().ref('metadata/' + user.uid);

      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      await  metadataRef.set({refreshTime: new Date().getTime()});
    } catch (error) {
      console.log(error);
    }
  
})