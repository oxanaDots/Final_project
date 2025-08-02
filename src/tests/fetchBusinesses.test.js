jest.mock('../firebase')
jest.mock('firebase/firestore', ()=>({

    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn()
  }
))


 import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
import { fetchBusinesses } from "../utilities/fetchBusinesses"


describe('fetchUpcomingExhibition function', ()=>{

  let myMap = new Map()

  beforeEach(async ()=>{
     
    // in the real fetchUpcomingExhibition function the snapshot.docs variable returns an array with induvidual 
    // document snapshots, each with its own id which is later assigned to docId field
    // this needs to be mocked and returned as a resolved promise since await getDocs() is an async function

    getDocs.mockResolvedValue({
    docs: [
     { id: "business1", data: () => ({ businessName: "One", geoLoc: {lat: 0, lgn:0} }) },
     { id: "business2", data: () => ({ businessName: "Two" , geoLoc : {lat: 1, lgn:2}}) },
    ]
       })

      })
      
      const fakeData = {
  "0, 0" :{ geoLoc: { lat:0, lng:0 },  businessName: "One", businessId: 'business1' },
  "1, 2" :{ geoLoc: { lat:1, lng:2 },  businessName: "Two" , businessId: 'business2'},
      }
       
       
       it ('The function should return correct data', async ()=>{
         //  data returns an array with objects, each with a docId and the rest of the key-field pairs are spread out using the spread operator
         // expect is called to determine if the fetchUpcomingExhibitions function returns expected data
        
           await fetchBusinesses()
    
            expect (collection).toHaveBeenCalled()
            expect (where).toHaveBeenCalled()
            expect (query).toHaveBeenCalled()
            expect (getDocs).toHaveBeenCalled()

            expect(fakeData["0, 0"]).toHaveProperty("geoLoc")
         
            
          })
          
          it('Empty data array returned by getDocs() should be undefined', async()=>{
           getDocs.mockResolvedValue({docs:[]})
 
            await fetchBusinesses()
         
            //   for (const item of data) {
            //   myMap.set(item.geoLoc, item);
            //  }
           
            expect().toBeUndefined()


          })

        

  
})


// appropriated from https://itnext.io/firebase-firestore-unit-testing-with-jest-and-kind-of-typescript-e26874196b1e