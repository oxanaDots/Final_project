import React from 'react';
jest.mock("../firebase.js");
jest.mock('firebase/firestore', () => ({
  getDocs:jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    fromDate: () => ({}),
   toDate: ()  => ({})},
  orderBy: jest.fn(),
  doc: jest.fn()
}))


import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Outlet, useOutletContext } from "react-router-dom"
import Admin from '../Admin/Admin'
 import { getDocs, collection, query, where, orderBy, Timestamp} from "firebase/firestore";
import ExhibitionSubmission from "../Admin/ExhibitionSubmission";


// the following approach to testing was appropriated from https://github.com/remix-run/react-router/blob/main/packages/react-router/__tests__/useOutlet-test.tsx
function renderHelper(id){

 function AdminTest() {
  const exhibitions = [
    { docId: '123', artistFirstName: 'ArtistOneName', artistLastName: 'ArtistOneLastName', title: 'Exhibition One' },
    { docId: '124', artistFirstName: 'ArtistTwoName',artistLastName: 'ArtistTwoLastName', title: 'Exhibition Two' }
  ];

  return <Outlet context={{ exhibitions }} />
}
  return  render(
      <MemoryRouter initialEntries={[`/admin/exhibition_submission/${id}`]}>
       <Routes>
         <Route  element={<AdminTest />}>
           <Route
           path={`/admin/exhibition_submission/${id}`}
           element={<ExhibitionSubmission  />}
         />
         </Route>
       </Routes>
     </MemoryRouter>
      )
}



describe ('Admin page', ()=>{
  const fakeTimestamp = {
    toDate: () => new Date(),
   
  }
    beforeEach(() => {
 
   getDocs.mockResolvedValue({
    docs: [
      { id: '123', data: () => ({ 
        title:'Exhibition One',
        status:'pending',
        artists_id: '1234ID',
        createdAt: fakeTimestamp
        })},
        { id: '234', data: () => ({ 
        title:'Exhibition Two',
        status:'pending',
        artists_id: '1234ID',
        createdAt: fakeTimestamp

        })}
    ]
  }) 
})
    it ('list all exhibitions and navigate to an induvidual exhibition item', async()=>{
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

      it("Returns correct context for exhibitions with docId: 124", async () => {
    

      renderHelper('124')

      expect(await screen.findByText('ArtistTwoName ArtistTwoLastName')).toBeInTheDocument()

    
    })


})