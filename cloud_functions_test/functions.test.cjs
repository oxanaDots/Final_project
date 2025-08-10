process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST= '127.0.0.1:9099';
process.env.FIREBASE_DATABASE_EMULATOR_HOST= '127.0.0.1:9000';

const mockery = require('mockery');
const admin = require('firebase-admin');
const { expect } = require('chai');
const assert = require('assert');

const test = require('firebase-functions-test')({
  projectId: 'art-hosting',
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
  


  after(() => {
   
    mockery.deregisterAll();
    mockery.disable();
  
  });


  async function helper(newStatus, artistEmail, userUid){

      const wrapped = test.wrap(myFunctions.notifyArtists)
      const beforeSnap = test.firestore.makeDocumentSnapshot({status: "pending", email: artistEmail}, `exhibitions/${userUid}`)
      const afterSnap = test.firestore.makeDocumentSnapshot({status: newStatus, email: artistEmail}, `exhibitions/${userUid}`)
      const change = test.makeChange(beforeSnap, afterSnap)

      
     const emailBody={
         to: afterSnap.data().email,
         body: 'Your exhibition submission has been accepted'
    }
      await wrapped(change)
      
      await transport.sendMail(emailBody)
      const sentEmail = nodemailermock.mock.getSentMail()
       return {sentEmail, afterSnap}
  }

 it('Setting custom claim on user sign up', async ()=> {
      
  const uid   = 'artist2';
  const email = 'artist2@example.com';
  

  const customClaims = {"artist": true}
  await admin.auth().createUser({ uid, email});

 
  const user = test.auth.makeUserRecord({ uid, email, customClaims});
  const wrapped  = test.wrap(myFunctions.processSignUp);
  await wrapped(user);
  assert.strictEqual(user.customClaims.artist, true);
   test.cleanup();
    })

  it('Send an artist an email notification about updated status of their exhibition submission', async ()=>{
      const{ sentEmail, afterSnap} = await  helper('accepted', 'artist@example.com', 'artist1')
      expect(sentEmail.length).to.equal(1)
      assert.strictEqual(sentEmail[0].to, afterSnap.data().email);
    })

     it('Send a welcome email to an enterprise', async ()=>{
      const{ sentEmail, afterSnap} = await  helper('accepted', 'artist@example.com', 'artist1')
      expect(sentEmail.length).to.equal(1)
      assert.strictEqual(sentEmail[0].to, afterSnap.data().email);
    })
   
  
})