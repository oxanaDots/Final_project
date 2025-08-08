// jest.mock('../firebase');
// const getDocs = jest.fn();

jest.mock('firebase/firestore', ()=>({

    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    getDocs: jest.fn()
  }
))
jest.mock('../firebase');


 import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
import { fetchUpcomingExhibitions } from '../utilities/fetchUpcomingExhibitions';
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
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();

});

       const mockedData = [
    { docId: "1",  title: "One"  },
    { docId: "2", title: "Two" }
    ]
       
       
       it ('The function should return correct data is docssnapshot return a non-empty object', async ()=>{
         //  data returns an array with objects, each with a docId and the rest of the key-field pairs are spread out using the spread operator
         // expect is called to determine if the fetchUpcomingExhibitions function returns expected data
         
         const date = new Date()

  const data = await fetchUpcomingExhibitions(date)
    
    expect (collection).toHaveBeenCalled()
    expect (where).toHaveBeenCalled()
    expect (orderBy).toHaveBeenCalled()
    expect (query).toHaveBeenCalled()
     expect (getDocs).toHaveBeenCalled()
    
    expect(data).toEqual(mockedData)

  })

  it('', async()=>{

    getDocs.mockResolvedValue({docs:[]})

     const data = await fetchUpcomingExhibitions()
     expect(data).toHaveLength(0)

})
})


// appropriated from https://itnext.io/firebase-firestore-unit-testing-with-jest-and-kind-of-typescript-e26874196b1e