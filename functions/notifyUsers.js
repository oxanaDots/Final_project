import {  onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { createTransport } from "nodemailer";
import { getDate } from "./utility/getDate.js";
import {  db } from './firebase.js'

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "oksanadotsenko967@gmail.com",
    pass: "dctglckihndwctps",
  },
});

// export const notifyEnterprise = onDocumentUpdated("exhibitions/{docId}", async (event) => {
//  try{
// const currentDay = Timestamp.fromDate(new Date());

//   const newValue = event.data.after.data();

//  if (newValue.status ==='accepted' && newValue.startsAt>= currentDay){

//  }

//   const businessesSnapshot = await admin.firestore().collection("businesses").get();
//   const emails = businessesSnapshot.docs.map(doc => doc.data().email);

//   const mailOptions = {
//     from: "noreply@art-hosting.firebaseapp.com",
//     to: emails,
//     subject: "New Art Exhibition Available",
//     text: '',
//   };


//   await transporter.sendMail(mailOptions);
//   logger.info("Emails sent");
//  }catch(err){
//   console.error(err)
//  }

 

// });

export const notifyArtists = onDocumentUpdated('exhibitions/{docId}', async(event)=> {
try{
   const newValue = event.data.after.data();
   const artistsId = newValue.artists_id
     const artistsSnapshot = await db.collection("artists").doc(artistsId).get();
    const email = artistsSnapshot.data().email


    let text = ''
    if(newValue.status === 'accepted'){
        text = `Congratulations! Your exhibition submission have been accepted. It's scheduled for display on ${getDate(newValue.startsAt)}.`
    } else if (newValue.status == 'rejected'){
        text = 'We are sorry to inform you that your exhibition submission has been rejected 😔.'
    }
    else {
      return
    }
    const mailOptions = {
    from: "noreply@art-hosting.firebaseapp.com",
    to: email,
    subject: "Exhibition submission update",
    text: text
  };

    await transporter.sendMail(mailOptions);
  logger.info("Emails sent");
} catch(err){
    console.error(err)
}

})

// firebase deploy --only functions:notifyArtists --project art-hosting