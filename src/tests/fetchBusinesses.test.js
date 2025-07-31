
import { readFileSync } from 'fs';

import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

import { getDoc, doc, getDocs, collection, setDoc } from 'firebase/firestore';

import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';



let testFirestoreEnv

describe('Art-hosting app', ()=>{
 beforeAll(async ()=>{
  testFirestoreEnv =   await initializeTestEnvironment({
  projectId: "art-hosting",
  firestore: {
  rules: readFileSync("firestore.rules", "utf8"),
  port: 8080,
  host: "127.0.0.1", 
  },

});
    })
    it('Read businesses collection', async ()=>{
    const db = testFirestoreEnv.unauthenticatedContext().firestore()
     const businesses = collection(db, 'businesses');

     await assertSucceeds(getDocs(businesses))
     

    })

   


})