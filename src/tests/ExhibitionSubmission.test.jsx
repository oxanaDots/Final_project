import '@testing-library/jest-dom'
jest.mock('firebase/firestore', () => ({
  getDocs:jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {fromDate: () => ({}) },
}))


// describe("", ()=>{
//     it ('', async ()=>{

//     })
// })