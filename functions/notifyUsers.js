import {  onDocumentUpdated , onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { createTransport } from "nodemailer";
import { getDate } from "./utility/getDate.js";
import {  db } from './firebase.js'
// import { query, where } from "mongoose";
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "oksanadotsenko967@gmail.com",
    pass: "dctglckihndwctps",
  },
});

export const sendWelcomeEmail = onDocumentCreated("businesses/{docId}", async (event) => {
 try{
 const data = event.data?.data()
 const userEmail = data.email
 const enterPriseName = `${data.firstName} ${data.lastName}`

 if (!userEmail || !enterPriseName){
  logger.warn('No email or name')
  return 
 }

  const mailOptions = {
    from: "noreply@art-hosting.firebaseapp.com",
    to: userEmail,
    subject: "Welcome to Art Hosting Platform",
    text: `Hello ${enterPriseName}, thank you for registering with our Art Hosting Platform`,
    html: `<p>Next Steps:</p>
    <p>Download our TV app.
     <a href="https://final-project-red-delta.vercel.app/"  target="_blank">
     here. 
    </a>
    
    </p>`

  }


  await transporter.sendMail(mailOptions);
  logger.info("Emails sent");
 }catch(err){
  console.error(err)
 }

});

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


// export const notifyAboutNewExhibitions = onDocumentUpdated('exhibitions/{docId}', async(event)=> {
// try{
//      const newValue = event.data.after.data();
//      const querry = query(
//         collection(db, 'exhibitions'),
//         where('status', '==', 'accepted'))

//    const acceptedExh = await getDocs(querry)
//   const businessesSNap = await getDocs(collection(db, 'businesses'));
//   const cities = businessesSNap.docs.map(doc => ({ ...doc.data().email }));
 

//    let text
//    if(newValue.status === 'accepted' && acceptedExh.length === 1){
//       text = 'Exhibitions are available to display'
//    }

   
//     const mailOptions = {
//     from: "noreply@art-hosting.firebaseapp.com",
//     to: email,
//     subject: "Exhibition submission update",
//     text: text
//   };

//     await transporter.sendMail(mailOptions);
//   logger.info("Emails sent");
// } catch(err){
//     console.error(err)
// }

// })
// firebase deploy --only functions:notifyArtists --project art-hosting