import React from 'react';
jest.mock('../firebase.js', ()=>({
  auth: {
    currentUser: null
  }
}));



jest.mock('firebase/firestore', ()=>({
  setDoc: jest.fn(),
  doc: jest.fn()
}))

jest.mock("../utilities/fetchData");
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn(),
  reload: jest.fn()
}));

jest.mock('../utilities/geoCode.mjs', () => ({
  geoCode: jest.fn(async () => {
    return {lat: 0.0, lng: 0.9};
  }),
}));



import "@testing-library/jest-dom";
import {  act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createUserWithEmailAndPassword,sendEmailVerification, onAuthStateChanged , reload} from "firebase/auth";
import { fetchData } from "../utilities/fetchData";
import BusinessSignup from '../Business/BusinessSignUp';
import {  setDoc } from "firebase/firestore";
import { geoCode } from '../utilities/geoCode.mjs';
import { auth, db } from "../firebase.js"; 



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
let emailVer

async function submit(){
   await userEvent.click(screen.getByRole('button', { name: /submit/i }));

}

async function confirmEmail(){
   await userEvent.click(screen.getByRole('button', { name: /I have completed verififcation/i }));

}
describe('Sign up form for enterprises', ()=>{
  beforeEach(()=>{
   geoCode.mockResolvedValue({lat: 0.0, lng: 0.9})
   
   fetchData.mockResolvedValue([
     {"email": "test_1@mail.com", "companyID": "RF238E2"}
    ])
   createUserWithEmailAndPassword.mockResolvedValue({
     user: {
       uid:   "123",
       email: "test_1@mail.com"
      }})

    // setDoc.mockResolvedValue(
    //   {doc: {geoLocation: {lat: 0.0, lng: 0.9}, email:  "test_1@mail.com", }}
    // )

      setDoc.mockRejectedValue((new Error('GeoCode is missing')))

  onAuthStateChanged.mockImplementation((auth, cb) => {
  emailVer = cb;
   return () => {};
});



  
  })


   afterEach(() => {
    jest.restoreAllMocks();
  });
    



 

it('Shows error when user enters wrong email and company id', async()=>{
  
   
     render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
    

      
    await fillInForm("wrong@mail.com", "wrong");
    await submit()
    const error =  await screen.findByTestId('signup-error');
    expect(error).toHaveTextContent('No record of your company has been found. Try again.');
 
  
  })

  it('Shows successfull account registration message', async ()=>{

        render (
          <MemoryRouter initialEntries={['/business_signup']}   >
              <Routes>
                <Route path="/business_signup" element={<BusinessSignup/>}/>
              </Routes>
            </MemoryRouter>
        )
 
        
 await fillInForm("test_1@mail.com", "RF238E2");

 await submit()
 expect(await screen.findByText(/We sent you an email verification link to your email address. Click on the button below once verification has been completed./i)).toBeInTheDocument();   
await confirmEmail()  
emailVer({emailVerified: true})
 expect(await screen.findByText(/Account created successfully!/i)).toBeInTheDocument();   


})



it('', async()=>{
  
  const errSpy = jest.spyOn(console, 'error').mockImplementation();
  reload.mockRejectedValueOnce((new Error('GeoCode is missing')))
  render (
    <MemoryRouter initialEntries={['/business_signup']}>
              <Routes>
                <Route path="/business_signup" element={<BusinessSignup/>}/>
              </Routes>
            </MemoryRouter>
        )
        await fillInForm("test_1@mail.com", "RF238E2");
        await submit()
        emailVer({ emailVerified: true });
        await confirmEmail()  

    await waitFor(async () => {
      expect(errSpy).toHaveBeenCalledWith(
       'Error occured:', 'GeoCode is missing'
       );

  })
    
 
  errSpy.mockRestore();


})


})