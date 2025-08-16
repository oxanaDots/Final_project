process.env.GCLOUD_PROJECT = 'art-hosting';
process.env.GOOGLE_CLOUD_PROJECT = 'art-hosting';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST= '127.0.0.1:9099';
process.env.FIREBASE_DATABASE_EMULATOR_HOST= '127.0.0.1:9000';

const mockery = require('mockery');
const admin = require('firebase-admin');
const { expect } = require('chai');
const assert = require('assert');

const test = require('firebase-functions-test')({
  projectId: 'art-hosting',
    databaseURL: 'https://art-hosting.firebaseio.com',

});

//dependencies for email noitfication
const nodemailermock = require('nodemailer-mock');
const transport = nodemailermock.createTransport({});

if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'art-hosting' });
}




describe('Cloud functions', ()=>{
let myFunctions
  before(async () =>{
    // Enable mockery to mock objects
    mockery.enable({
      warnOnUnregistered: false,
    });

    mockery.registerMock('nodemailer', nodemailermock)
    mockery.registerAllowable('../functions/index.js');

   myFunctions = require('../functions/index.js')
  })
  


  afterEach(async () => {
   
    mockery.deregisterAll();
    mockery.disable();
    nodemailermock.mock.reset();
    test.cleanup(); 

  
  });


  async function helper(newStatus, artistEmail, userUid, exhibitionId){

      const wrapped = test.wrap(myFunctions.notifyArtists)
      const beforeSnap = test.firestore.makeDocumentSnapshot({status: "pending", artists_id: userUid}, `exhibitions/${exhibitionId}`)
      const afterSnap = test.firestore.makeDocumentSnapshot({status: newStatus,  artists_id: userUid}, `exhibitions/${exhibitionId}`)
      const artistSnap = test.firestore.makeDocumentSnapshot({email: artistEmail,  artists_id: userUid}, `artists/${userUid}`)

      const change = test.makeChange(beforeSnap, afterSnap)

      
     const emailBody={
         to: artistSnap.data().email,
         body: 'Your exhibition submission has been accepted'
    }
      await wrapped(change, { params: { docId: exhibitionId } })
      
      await transport.sendMail(emailBody)
      const sentEmail = nodemailermock.mock.getSentMail()
       return {sentEmail, afterSnap, artistSnap}
  }


  it('Sends an artist an email notification about updated status of their exhibition submission', async ()=>{
      const{ sentEmail, afterSnap, artistSnap} = await  helper('accepted', "artist_test_1@example.com"
, 'artist1', 'exhibitionId')
     
      expect(sentEmail.length).to.equal(1)
      assert.strictEqual((sentEmail[0].to), artistSnap.data().email);
    })



     it('Sets custom claim on artist sign up', async ()=> {
      
 
  const uid  = 'artist2';
  const email = 'artist2@example.com';
  

  const customClaims = {"artist": true}
  await admin.auth().createUser({ uid, email});

 
  const user = test.auth.makeUserRecord({ uid, email, customClaims});
  const wrapped  = test.wrap(myFunctions.artistProcessSignUp);
  await wrapped(user);
  assert.strictEqual(user.customClaims.artist, true);

 
    })

  it('Sets custom claim on business sign up', async ()=> {
      
 
  const uid = 'uniqueId';
  const email = 'business1@example.com';
  

 await admin.auth().createUser({ uid, email});

await admin.firestore().doc(`businesses/${uid}`).set({ role: 'business', email });

const snap = test.firestore.makeDocumentSnapshot({ role: 'business', email }, `businesses/${uid}`);
const wrapped = test.wrap(myFunctions.businessProcessSignUp);
await wrapped(snap, {params:{uid}})
 const data = await admin.auth().getUser(uid);
  assert.strictEqual(data.customClaims.business, true);



 
    })


     it('Sends a welcome email to an enterprise on successful account registration', async ()=>{
      const user = test.firestore.makeDocumentSnapshot({enterPriseName:"test", email: 'test@mail.com'})
     const wrapped = test.wrap(myFunctions.sendWelcomeEmail)
     await wrapped(user)
     const emailBody={
       to: user.data().email,
       subject:"Welcome to Art Hosting Platform"
      }
      await transport.sendMail(emailBody)
      const sentEmail = nodemailermock.mock.getSentMail()
     expect(sentEmail.length).to.equal(1)
      expect(sentEmail[0]).to.have.property( 'to', 'test@mail.com')

  

    })


   
  
})
