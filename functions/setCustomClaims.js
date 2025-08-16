
import * as functions from 'firebase-functions';
import { auth, db } from './firebase.js'
import { getDatabase } from 'firebase-admin/database';
import {onDocumentCreated} from "firebase-functions/v2/firestore";

export const artistProcessSignUp = functions.auth.user().onCreate(async (user) => {

    const artistDoc = await db.collection('artists').doc( user.uid).get()


    try {
 let customClaims={}

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


export const businessProcessSignUp = onDocumentCreated('businesses/{uid}', async (event) => {
  const user = await auth.getUser(event.params.uid);
  const enterpriseDoc = event.data;
try{

  let customClaims = {};
  if (user.email && enterpriseDoc && enterpriseDoc.data().role === 'business') {
    customClaims = { business: true };
  }
  
    // Set custom user claims on this newly created user.
      await auth.setCustomUserClaims(user.uid, customClaims);

      // Update real-time database to notify client to force refresh.
      const metadataRef = getDatabase().ref('metadata/' + user.uid);

      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      await  metadataRef.set({refreshTime: new Date().getTime()});
}catch(err){
  console.error(err)
}
});