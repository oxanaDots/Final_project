
jest.mock('firebase/firestore', ()=>({
// mock the module's functionsand eulate Timestamp export
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn()

  }
))

jest.mock("../Forms/UserAuthContext", ()=>({
    UserAuthContext: ()=> ({
        user: {
        id: 'userId',
        firstName:'First Name',
        lastName: 'Last Name '},
        setUser: jest.fn()
    })
}))

jest.mock("firebase/storage", ()=>({
ref:jest.fn(),
uploadBytes:jest.fn(),
getDownloadURL:jest.fn()
}))


jest.mock('../firebase');
import { waitFor, screen, render } from "@testing-library/react";
import {  addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ArtistDashboard from "../Artists/ArtistDahsBoard";
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UploadExhibition from "../Artists/UploadExhibition";
import '@testing-library/jest-dom';

// appropriated from https://testing-library.com/docs/user-event/utility/
const files = [
            new File(['hello'], 'hello.png', {type: 'image/png'}),
            new File(['there'], 'there.png', {type: 'image/png'}),
            ]
const mockexcedeLimit = Array.from({length: 11}, ( _, i)=> new File([`file${i}`], `${i}.png`, {type: 'image/png'}))
 const imagePaths = Array.from({length: 10}, (_, i) => `image0${i}.jpg`)


function renderHelper(initialEntry){
        render(
        <MemoryRouter  initialEntries={[initialEntry]}>
            <Routes>
                <Route  path='/artist_dashboard' element={ <ArtistDashboard/>}>
                <Route path='add_exhibition' element={<UploadExhibition/>}/>
                </Route>
            </Routes>
        </MemoryRouter>
        )
    }

    async function uploadHelper(files, initialEntry){
         getDocs.mockResolvedValue({ docs: [] });
          renderHelper(initialEntry)

          const browseButton = await screen.findByTestId('browse-button')
            await userEvent.click(browseButton)
            const input = await screen.findByTestId('input-files')
        
            const user = userEvent.setup()

            await user.upload(input, files)
            return input 
    }






describe('',  ()=>{
      window.URL.createObjectURL = jest.fn();
    beforeEach(()=>{
         getDocs.mockResolvedValue({docs:[
            {id: '123',
            data: ()=> ({ title:'Title One'})}
        ]})
        getDownloadURL.mockResolvedValue(imagePaths)
        addDoc.mockResolvedValue({images:imagePaths, title:'title'})
    })


    it("Show details of an exhibition that's been uploaded", async()=>{
       renderHelper('/artist_dashboard')
       
        // fireEvent.click(screen.getByTestId('browse-files'))
        waitFor(async ()=>{
            expect(await screen.getByText('Title One')).toBeInTheDocument()

        })
    })


     it("Show upload interface and allows to upload file", async()=>{

    
           
          
       const input = await uploadHelper(files, '/artist_dashboard')
      expect(input.files).toHaveLength(2)

    })

    it("Shows error message when upload limit is exceded", async()=>{

    const input = await uploadHelper(mockexcedeLimit, '/artist_dashboard')
      expect(input.files).toHaveLength(11)
      expect (await screen.getByText('Make sure you do not exceed upload limits for file size and amount.')).toBeInTheDocument()

      
    })

    it('Files length updates after deleting a file item', async()=>{
      await uploadHelper(mockexcedeLimit, '/artist_dashboard')
     const deleteBtn = await screen.findByTestId('delete-button-1')
      await userEvent.click(deleteBtn)
     expect(screen.getAllByTestId('file-item')).toHaveLength(10);

    })

    it('Navigates to /add_exhibition on button click, upload exhibition material and returns to artist dashboard.', async()=>{
    
        
        await uploadHelper(files, '/artist_dashboard')
        const next = await screen.findByTestId('next')
        await userEvent.click(next)
         expect (await screen.getByText('Add exhibition details:')).toBeInTheDocument()
        await userEvent.type(screen.getByPlaceholderText(/exhibition name/i), "title");
        await userEvent.type(screen.getByPlaceholderText(/art medium/i), 'medium');

        const submit = await screen.findByTestId('submit')
        await userEvent.click(submit)
        expect (await screen.getByText('Your files have been uploaded!')).toBeInTheDocument()

         const returnToDash = await screen.findByTestId('return-to-dashboard')
        await userEvent.click(returnToDash)
         expect (await screen.getByText('Your exhibition preview:')).toBeInTheDocument()

    })

   
})