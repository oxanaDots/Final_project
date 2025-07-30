import React from 'react';
jest.mock("../firebase.js");
jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
  query:  jest.fn(),
  where:  jest.fn(),
  orderBy: jest.fn(),
  Timestamp:  { fromDate: () => ({ toDate: () => new Date() }) },
}))

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Admin from '../Admin/Admin'
import * as firestore from 'firebase/firestore'
import ExhibitionSubmission from "../Admin/ExhibitionSubmission";


describe ('Admin page', ()=>{
  const fakeTimestamp = {
    toDate: () => new Date(),
   
  }
    beforeEach(() => {
 
  firestore.getDocs.mockResolvedValue({
    docs: [
      { id: '123', data: () => ({ 
        title: 'TestOne',
        status:'pending',
        artists_id: '1234ID',
        createdAt: fakeTimestamp
        })},
        { id: '234', data: () => ({ 
        title: 'TestTwo',
        status:'pending',
        artists_id: '1234ID',
        createdAt: fakeTimestamp

        }) },
      
    ]
  }) 
})
    it ('list all exhibitions and navigate to an induvidual exhibition item', async()=>{
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route
          path="/admin/exhibition_submission/:id"
          element={<ExhibitionSubmission />}
        />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  expect(await screen.findByText('TestOne')).toBeInTheDocument()

  fireEvent.click(screen.getByTestId('exhibition-item-0'))

  expect(await screen.findByTestId('submission-outcome')).toBeInTheDocument()

})

// it('navigate to exhibition item', async()=>{

//     render(
//         <MemoryRouter>
//             <ExhibitionSubmission/>
//         </MemoryRouter>
//     )

    
// })
})