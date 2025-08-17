import React from 'react';
jest.mock("../firebase.js");
jest.mock('firebase/firestore', () => ({
  getDocs:jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    fromDate: (date) => ({
      toDate: () => date
    })},

  orderBy: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn()
}))


import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom"
import Admin from '../Admin/Admin'
 import { getDocs, doc, updateDoc, query, where, orderBy, Timestamp} from "firebase/firestore";
import ExhibitionSubmission from "../Admin/ExhibitionSubmission";


// the following approach to testing was appropriated from https://github.com/remix-run/react-router/blob/main/packages/react-router/__tests__/useOutlet-test.tsx
function renderHelper(id){

 function AdminTest() {
  const exhibitions = [
    { docId: '123', artistFirstName: 'ArtistOneName', artistLastName: 'ArtistOneLastName', title: 'Exhibition One', },
    { docId: '124', artistFirstName: 'ArtistTwoName',artistLastName: 'ArtistTwoLastName', title: 'Exhibition Two' }
  ];

  return (
<>
    <h2 className='font-semibold py-4'> Exhibition submissions</h2>
    <Outlet context={{ exhibitions }} />
    </>
  )
}
  return  render(
      <MemoryRouter initialEntries={[`/admin/exhibition_submission/${id}`]}>
       <Routes>
         <Route path='/admin'  element={<AdminTest />}>
           <Route
           path={`/admin/exhibition_submission/${id}`}
           element={<ExhibitionSubmission  />}
         />
         </Route>
       </Routes>
     </MemoryRouter>
      )
}

 const acceptedDocs = [
  {
    id: '345',
    data: () => ({
      title: 'Exhibition Four',
      status: 'accepted',
      artists_id: '123ID',
      createdAt: Timestamp.fromDate(new Date('2025-08-02')),
      expireAt: Timestamp.fromDate(new Date('2025-08-10'))
    })
  },
  {
    id: '678',
    data: () => ({
      title: 'Exhibition Five',
      status: 'accepted',
      artists_id: '124ID',
      createdAt: Timestamp.fromDate(new Date('2025-08-01')),
       expireAt: Timestamp.fromDate(new Date('2025-10-04'))

    })
  }
];


let docsArray


describe ('Admin page', ()=>{

  
    beforeAll(() => {
  const fakeTimestamp = {
    toDate: () => new Date()}


 

     docsArray = [
      { id: '123', data: () => ({ 
        title:'Exhibition One',
        status:'pending',
        artists_id: '123ID',
        createdAt: fakeTimestamp
        })},
        { id: '234', data: () => ({ 
        title:'Exhibition Two',
        status:'pending',
        artists_id: '124ID',
        createdAt: fakeTimestamp

        })}
    ]

})


afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
    it ('list all exhibitions and navigate to an individual exhibition item', async()=>{

      getDocs.mockResolvedValue({
          
            docs: docsArray,
            size: docsArray.length
           
  }) 
  render(
    // MemoryRouter is one of the components provided by React Router to manage navigation inside the app instead of relying on the browser's url,
    // and it is not tied to an external source, like the history stack in a browser

    
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route
          path="/admin/exhibition_submission/:id"
          element={<ExhibitionSubmission/>}
        />
        </Route>
      </Routes>
    </MemoryRouter>
  )


  expect(await screen.findByText('Exhibition One')).toBeInTheDocument()

  fireEvent.click(screen.getByTestId('exhibition-item-0'))

  expect(await screen.findByTestId('submission-outcome')).toBeInTheDocument()

})


   it("Returns correct context for exhibitions with docId: 123", async () => {
    

    renderHelper('123')

      expect(await screen.findByText('ArtistOneName ArtistOneLastName')).toBeInTheDocument()

    
    })


   it("Returns correct context for exhibitions with docId: 124", async () => {
     renderHelper('124')

      expect(await screen.findByText('ArtistTwoName ArtistTwoLastName')).toBeInTheDocument()

    
    })

      it("Updates an exhibition document status and shows confirmation UI", async () => {
     renderHelper('124')
  
       doc.mockReturnValue({id: '124'})
       getDocs.mockResolvedValue({docs: acceptedDocs, size: acceptedDocs.length})
       updateDoc.mockResolvedValue({status:'accepted', startsAt:Timestamp.fromDate(new Date('2025-10-20'))})
   

       fireEvent.click(screen.getByTestId('accept'))

       expect(await screen.findByText('Submission updated!')).toBeInTheDocument()
    
    })


      it("Updates an exhibition document status, shows confirmation UI and navigates to admin dashboard", async () => {
      renderHelper('124')
  
       doc.mockReturnValue({id: '124'})
       getDocs.mockResolvedValue({docs: acceptedDocs, size: acceptedDocs.length})
       updateDoc.mockResolvedValue({status:'rejected'})
   

       fireEvent.click(screen.getByTestId('reject'))

       expect(await screen.findByText('Submission updated!')).toBeInTheDocument()


        // fireEvent.click(screen.getByTestId('return-to-admin'))
        expect(await screen.findByText('Exhibition submissions')).toBeInTheDocument()
    
    })

  


})