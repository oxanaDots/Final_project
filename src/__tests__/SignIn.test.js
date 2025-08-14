import React from 'react';
jest.mock('../firebase.js', () => {
  return {
    auth: jest.fn(),
    db:jest.fn()
  };
});

jest.mock("../Forms/UserAuthContext", ()=>({
    UserAuthContext: ()=> ({
        setUser: jest.fn()
    })
}))

jest.mock('firebase/firestore', ()=>({
  getDoc: jest.fn(),
  doc:jest.fn()
}))


jest.mock("../utilities/fetchData");
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn()
}));





import "@testing-library/jest-dom";
import {  render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { UserAuthContext } from '../Forms/UserAuthContext';
import SignIn from '../Forms/SignIn'


function Artist(){
    return(
        <p>Artist</p>
    )
}
function Admin(){
    return(
       <p>Admin</p>
    )
}

async function fillInForm(email, password){

      await userEvent.type(screen.getByPlaceholderText(/email address/i), email);
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), password);


}

async function submit(){
   await userEvent.click(screen.getByTestId('submit-btn'));

}





function renderHelper(){
       render(
    <MemoryRouter initialEntries={['/signin']}>
        <Routes>
            <Route path='/artist_dashboard' element={<Artist/>}/>
             <Route path='/admin' element={<Admin/>}/>

        </Routes>
      <SignIn/>
    </MemoryRouter>);
}
describe('Sign up form for enterprises', ()=>{

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();

});
 





it('Shows error on wrongly formatted email or passowrd', async()=>{

   
   renderHelper()
            
        await fillInForm('wrong', 'wrong')
        await submit()
        
        expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
         expect(await screen.findByText('Password must be at least 6 characters long')).toBeInTheDocument();

  })




  it('Navigates to Admin dashboard', async()=>{
  
    signInWithEmailAndPassword.mockResolvedValueOnce({
       user:{
        uid:'456',
         email: 'admin1234@test.com'
       }
    })
 getDoc.mockResolvedValueOnce({ exists: () => false });
 renderHelper()


     await fillInForm('admin1234@test.com', 'admin1234')
     await submit()
     expect (await screen.findByText('Admin')).toBeInTheDocument()
  })


  it('Navigates to Artist dashboard', async()=>{
  
   signInWithEmailAndPassword.mockResolvedValueOnce({
       user:{
        uid:'123',
         email: 'test@mail.com'
       }
    })

    getDoc.mockResolvedValueOnce({
        exists: () => true, data: () => ({ email: 'test@mail.com' }) 
    })
    doc.mockReturnValue({}); 
 renderHelper()


     await fillInForm('test@mail.com', '123456pass')
     await submit()
     expect (await screen.findByText('Artist')).toBeInTheDocument()
  })

  
    it('Shows an error message for a non exist user account', async()=>{
    getDoc.mockResolvedValueOnce({ exists: () => false });

   signInWithEmailAndPassword.mockRejectedValueOnce(
    (new Error('Email address is invalid.')), {code: 'auth/invalid-email"' }
   )

   
 renderHelper()


     await fillInForm('test@mail.com', 'pass123456')
     await submit()
      await screen.findByText('Email address is invalid.');
  })



 
})







