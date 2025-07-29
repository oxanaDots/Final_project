import * as firebase from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing"
import { getDoc, doc, getDocs, collection, setDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';


let testFirestoreEnv = await initializeTestEnvironment({
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
    it('Read businesses collection', async ()=>{
    const db = testFirestoreEnv.unauthenticatedContext().firestore()
     const businesses = collection(db, 'businesses');
    await assertSucceeds(getDocs(businesses))
    })

     it('Write to a businesses collection by users who are signed in and owners of a doc', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'business_test_1').firestore();
    const docRef = doc(db, 'businesses', 'business_test_1')
       await assertSucceeds(setDoc(docRef, { 'business_test_1': {businessName: 'Business Name'}}))
    })
     it('Fail writing to businesses collection by a user who is signed in but not an owner of a doc', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'business_test_1').firestore();
    const docRef = doc(db, 'businesses', 'business_test_2')
       await assertFails(setDoc(docRef, { 'business_test_2': {businessName: 'Business Name'}}))
    })

     it('Fail writing to artists collection by a user who is signed in but not an owner of a doc', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'artist_test_1').firestore();
    const docRef = doc(db, 'artists', 'artist_test_1')
       await assertSucceeds(setDoc(docRef, { 'artist_test_1': {artistFirstName: 'Name', email: 'artist_test_1@example.com'}}))
    })

       it('Write to a exhibitions collection by users who are signed in and owners of a doc', async ()=>{
    const db = testFirestoreEnv.authenticatedContext('artist1').firestore();
    const docRef = doc(db, 'exhibitions', 'exhibitionId')
       await assertSucceeds(setDoc(docRef, {artists_id: 'artist1' }))
       })


      it('Write to all exhibitions collection docs by admin', async ()=>{
    const db = testFirestoreEnv.authenticatedContext( 'admin',  {email: "admin1234@test.com"}).firestore();
    const docRef = doc(db, 'exhibitions', 'exhibitionId')
       await assertSucceeds(setDoc(docRef, { status: 'accepted', artists_id:'artist1'}))
    })

       it('Write to exhibitions storage by authenticated (signed in) artists', async ()=>{
    const db = testStorageEnv.authenticatedContext('artist1', {artist: true}).storage();
    const imageRef = ref(db, 'exhibitions/artist1/image1.jpg')
   
       await assertSucceeds(uploadBytes(imageRef))
    })

       it('Read exhibitions storage by authenticated (signed in) enterprises', async ()=>{
    const db = testStorageEnv.authenticatedContext('business1', {business: true}).storage();
    const imageRef = ref(db, 'exhibitions/image1.jpg')
   
       await assertSucceeds(getDownloadURL(imageRef))
    })

        it('Read files in exhibitions storage by authenticated artists who own those files', async ()=>{
    const db = testStorageEnv.authenticatedContext('artist1', {artist: true}).storage();
    const imageRef = ref(db, 'exhibitions/artist1/image1.jpg')
   
       await assertSucceeds(getDownloadURL(imageRef))
    })

       it('Fail read exhibitions storage by unauthenticated users', async ()=>{
    const db = testStorageEnv.unauthenticatedContext().storage();
    const imageRef = ref(db, 'exhibitions/artist1/image1.jpg')
   
       await assertFails(getDownloadURL(imageRef))
    })


})