
import { readFileSync } from 'fs';

import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

import { getDoc, doc, getDocs, collection, setDoc } from 'firebase/firestore';

import { uploadBytes, ref, getDownloadURL, getBytes } from 'firebase/storage';



let testFirestoreEnv= await initializeTestEnvironment({
  projectId: "art-hosting",
  firestore: {
  rules: readFileSync("firestore.rules", "utf8"),
  port: 8080,
  host: "127.0.0.1", 
  },

});
let testStorageEnv = await initializeTestEnvironment({
     projectId: "art-hosting",
     storage:{
        rules: readFileSync("storage.rules", 'utf8'),
        host:"127.0.0.1",
        port: 9199
     }
})



describe('Art-hosting app', ()=>{
    it('Should deny read access to businesses collection for an unauthorised user', async ()=>{
    const db = testFirestoreEnv.unauthenticatedContext().firestore()
     const businesses = collection(db, 'businesses');
    await assertSucceeds(getDocs(businesses))
    })

     it('Should allow write access to businesses collection for an authorised user who is an owner of the document', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'business_test_1').firestore();
    const docRef = doc(db, 'businesses', 'business_test_1')
       await assertSucceeds(setDoc(docRef, { 'business_test_1': {businessName: 'Business Name'}}))
    })
     it('Should deny write access to businesses collection for a user who is signed in but not an owner of the document', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'business_test_1').firestore();
    const docRef = doc(db, 'businesses', 'business_test_2')
       await assertFails(setDoc(docRef, { 'business_test_2': {businessName: 'Business Name'}}))
    })

     it('Should deny write access to artists collection for an authorised user who is not an owner of a document', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'artist1').firestore();
    const docRef = doc(db, 'artists', 'artist1')
       await assertSucceeds(setDoc(docRef, { 'artist1': {artistFirstName: 'Name', email: 'artist_test_1@example.com'}}))
    })

       it('Should allow write access to exhibitions collection for an authorised user who is an owner of a document', async ()=>{
    const db = testFirestoreEnv.authenticatedContext('artist1').firestore();
    const docRef = doc(db, 'exhibitions', 'exhibitionId')
       await assertSucceeds(setDoc(docRef, {artists_id: 'artist1' }))
       })


      it('Should allow write access to all exhibitions docs for admin', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'admin',  {email: "admin1234@test.com"}).firestore();
    const docRef = doc(db, 'exhibitions', 'exhibitionId')
       await assertSucceeds(setDoc(docRef, { status: 'accepted', artists_id:'artist1'}))
    })

       it('Should allow write access to exhibitions storage bucket for authenticated artists', async ()=>{
    const db = testStorageEnv.authenticatedContext('artist1', {artist: true}).storage();
    const imageRef = ref(db, 'exhibitions/artist1/image1.jpg')
   
       await assertSucceeds(uploadBytes(imageRef))
    })

       it('Should allow read access to exhibitions storage bucket for an authenticated enterprise user', async ()=>{
    const db = testStorageEnv.authenticatedContext('business1', {business: true}).storage();
    const imageRef = ref(db, 'exhibitions/artist1/image1.jpg')
   
       await assertSucceeds(getDownloadURL(imageRef))
    })

        it('Should allow read access to files in the storage for an authenticated artist who is an owner of the files', async ()=>{
    const db = testStorageEnv.authenticatedContext('artist1', {artist: true}).storage();
    const imageRef = ref(db, 'exhibitions/artist1/image1.jpg')
   
       await assertSucceeds(getBytes(imageRef))
    })

       it('Should deny read access to exhibitions storage bucket for unauthenticated users', async ()=>{
    const db = testStorageEnv.unauthenticatedContext().storage();
    const imageRef = ref(db, 'exhibitions/artist1/image1.jpg')
   
       await assertFails(getDownloadURL(imageRef))
    })




})