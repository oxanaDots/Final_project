import React from 'react';
jest.mock('../firebase.js', () => {
  return {
    auth: jest.fn(),
    currentUser:{
   email: "test@mail.com",
   uid: "123"
    }
  };
});

// jest.mock('../Forms/UserAuthContext', () => ({
//   UserAuthContext: () => ({ setUser: jest.fn() })
// }));

jest.mock('firebase/firestore', ()=>({
  setDoc: jest.fn()
}))

jest.mock("../utilities/fetchData");
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn()
}));

jest.mock('../utilities/geoCode.mjs', () => ({
  geoCode: jest.fn(async () => {
    return {lat: 0.0, lng: 0.9};
  }),
}));



import "@testing-library/jest-dom";
import {  render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fetchData } from "../utilities/fetchData";
import BusinessSignup from '../Business/BusinessSignUp';
import {  setDoc } from "firebase/firestore";
import { geoCode } from '../utilities/geoCode.mjs';
import SignIn from '../Forms/SignIn'
import { UserAuthContext } from '../Forms/UserAuthContext';

async function fillInForm(email, companyId){
   await userEvent.type(screen.getByPlaceholderText(/business name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/company id/i), companyId);
      await userEvent.type(screen.getByPlaceholderText(/first name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/last name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/email address/i), email);
      await userEvent.type(screen.getByPlaceholderText(/business address/i), "Green street");
      await userEvent.type(screen.getByPlaceholderText(/postcode/i), "E1 38CD");
      await userEvent.type(screen.getByPlaceholderText(/phone number/i), "07889546333");
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), "Password123");
      await userEvent.type(screen.getByPlaceholderText(/^confirm password$/i), "Password123");
      await userEvent.selectOptions(screen.getByRole('combobox'), "Services");

}

async function submit(){
   await userEvent.click(screen.getByRole('button', { name: /submit/i }));

}
describe('Sign up form for enterprises', ()=>{
  beforeEach(()=>{
    geoCode.mockResolvedValue({lat: 0.0, lng: 0.9})
   
 fetchData.mockResolvedValue([
          {"email": "test@mail.com", "companyID": "RF238E2"}
        ])
   createUserWithEmailAndPassword.mockResolvedValue({
     user: {
       uid:   "123",
       email: "test_1@mail.com"
      }
    });
    setDoc.mockResolvedValue(
      {geoLocation: {lat: 0.0, lng: 0.9}, email:  "test_1@mail.com", }
    )
  })

   afterEach(() => {
    jest.restoreAllMocks();
  });
    


 

it('signUpError state change', async()=>{
  
   
     render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
    

      
    await fillInForm("wrong@mail.com", "wrong");
    await submit()
       const error =  await screen.findByTestId('signup-error');
       
       expect(error).toHaveTextContent('No record of your company has been found. Try again.');
 
  
  })

  it('Navigate to Sign In page', async ()=>{
        render (
          <MemoryRouter initialEntries={['/business_signup']}   >
              <Routes>
                <Route path="/business_signup" element={<BusinessSignup/>}/>
                 <Route path="/signin" element={<SignIn />} />
           
              </Routes>
            
            </MemoryRouter>
        )
 
        
   await fillInForm("test@mail.com", "RF238E2");
   await submit()
  
   
    expect(await screen.findByText('/signin')).toBeInTheDocument()

   })

 
})