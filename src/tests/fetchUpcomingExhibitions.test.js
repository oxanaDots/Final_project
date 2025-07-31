
import { readFileSync } from 'fs';

import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

import { getDoc, doc, getDocs, collection, setDoc } from 'firebase/firestore';



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
          it('Read exhibitions collection', async ()=>{
          const db = testFirestoreEnv.unauthenticatedContext().firestore()
           const exhibitions = collection(db, 'exhibitions');
      
           await assertSucceeds(getDocs(exhibitions))
           
      
          })
    

    

        })