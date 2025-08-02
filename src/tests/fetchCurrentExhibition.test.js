// jest.mock('../firebase');
// const getDocs = jest.fn();
// mock firebase/firestore module and its fucntions
jest.mock('firebase/firestore', ()=>({
// mock the module's functionsand eulate Timestamp export
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    getDocs: jest.fn(),
  Timestamp: {
    fromDate: jest.fn( new Date())
  }
  }
))
jest.mock('../firebase');


 import { getDocs, collection, query, where, orderBy, Timestamp} from "firebase/firestore";
import { fetchCurrentExhibition } from '../utilities/getchCurrentExhibition';
import { waitFor } from '@testing-library/react';




describe('fetchUpcomingExhibition function', ()=>{

  
  beforeEach(async ()=>{
     
    // in the real fetchUpcomingExhibition function the snapshot.docs variable returns an array with induvidual 
    // document snapshots, each with its own id which is later assigned to docId field
    // this needs to be mocked and returned as a resolved promise since await getDocs() is an async function

       getDocs.mockResolvedValue({
    docs: [
     { id: "1", data: () => ({ title: "One" }) },
     { id: "2", data: () => ({ title: "Two" }) }
    ]
       })

      })


       const mockedData = [
    { docId: "1",  title: "One"  },
    { docId: "2", title: "Two" }
    ]
      
       
       it ('The function should return correct data', async ()=>{
         //  data returns an array with objects, each with a docId and the rest of the key-field pairs are spread out using the spread operator
         // expect is called to determine if the fetchCurrentExhibition function returns expected data
         
         const date = new Date()

  const data = await fetchCurrentExhibition(date)
    
 

    
    expect(data).toEqual(mockedData)

  })

  it('', async()=>{
  waitFor(()=>{
    getDocs.mockResolvedValue({docs:[]})
  })
     const data = await fetchCurrentExhibition()
     expect(data).toHaveLength(0);

})
})


// appropriated from https://itnext.io/firebase-firestore-unit-testing-with-jest-and-kind-of-typescript-e26874196b1e