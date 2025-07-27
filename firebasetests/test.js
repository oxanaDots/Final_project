import * as firebase from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing"
import { getDoc, doc, getDocs, collection, setDoc } from 'firebase/firestore';



let testEnv = await initializeTestEnvironment({
  projectId: "art-hosting",
  firestore: {
  rules: readFileSync("firestore.rules", "utf8"),
  port: 8080,
  host: "127.0.0.1",
  },

});


describe('Art-hosting app', ()=>{
    it('Read businesses collection', async ()=>{
    const db = testEnv.unauthenticatedContext().firestore()
     const businesses = collection(db, 'businesses');
    await assertSucceeds(getDocs(businesses))
    })

     it('Write to businesses collection', async ()=>{
    const db = testEnv.authenticatedContext( {uid: 'business1'}).firestore();
    const docRef = doc(db, 'businesses', 'business1')
       await assertSucceeds(setDoc(docRef, { businessId: '123' }))
    })
})