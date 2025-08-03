jest.mock('../firebase');
jest.mock('firebase/firestore', () => ({
  getDocs:jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {fromDate: () => ({}) },
  orderBy: jest.fn(),
  doc: jest.fn()
}))




import {  doc,collection, Timestamp, updateDoc, where, getDocs, query, orderBy  } from 'firebase/firestore';
import '@testing-library/jest-dom'
import ExhibitionSubmission from '../Admin/ExhibitionSubmission'
import Admin from '../Admin/Admin'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, fireEvent, screen } from '@testing-library/react';

const id = '123'

describe("", ()=>{
    const mockedExh = [
        {docId: '123', artistFirstName: 'Artist One', title:'Exhibition One'},
        {docId: '124', artistFirstName: 'Artist Two', title:'Exhibition Two'}
    ]


  

    beforeAll(()=>{

        
        // getDocs.mockResolvedValue([
        //     {title: 'One', status: 'accepted'}
        // ])
        
        //  getDocs.mockResolvedValue([
        //     {title: 'Two', status: 'relected'}
        // ])

      

})

    it ('', async ()=>{

           render(
            <MemoryRouter initialEntries={[`/admin/exhibition_submission/${id}`]}>
                <Routes>
                    <Route element={<Admin exhibitions={mockedExh}/> }>
                       <Route path={`/admin/exhibition_submission/${id}`}   element={<ExhibitionSubmission />}/>
                    </Route>
                </Routes>
            </MemoryRouter>
          
        )
    

       fireEvent.click(screen.getByTestId('accept'))
    //    expect(awaitscreen.getByText('Submission updated!')).toBeInTheDocument();

    
    })
})