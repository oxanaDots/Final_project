
import * as functions from 'firebase-functions';
import { auth, db } from './firebase.js'


export const processSignUp = functions.auth.user().onCreate(async (user) => {

  const userId = user.uid
  const enterpriseDoc = await db.collection('businesses').doc(userId).get()
    const artistDoc = await db.collection('artists').doc(userId).get()


    try {
 let customClaims={}

          if (user.email && enterpriseDoc.exists && enterpriseDoc.data().role === 'business') {
     customClaims = {
      business: true,
      }
    } else if (user.email && artistDoc.exists && artistDoc.data().role === 'artist') {
     customClaims = {
      artist: true,
      
    }};
      // Set custom user claims on this newly created user.
      await getAuth().setCustomUserClaims(user.uid, customClaims);

      // Update real-time database to notify client to force refresh.
      const metadataRef = getDatabase().ref('metadata/' + user.uid);

      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      await  metadataRef.set({refreshTime: new Date().getTime()});
    } catch (error) {
      console.log(error);
    }
  
})