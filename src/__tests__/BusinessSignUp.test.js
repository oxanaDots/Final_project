import React from 'react';
jest.mock('../firebase.js', ()=>({
 sourceType:module,
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
  geoCode: jest.fn(),
}));



import "@testing-library/jest-dom";
import {  act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createUserWithEmailAndPassword,sendEmailVerification, onAuthStateChanged , reload} from "firebase/auth";
import { fetchData } from "../utilities/fetchData.js";
import BusinessSignup from '../Business/BusinessSignUp.jsx';
import {  doc, setDoc } from "firebase/firestore";
import { geoCode } from '../utilities/geoCode.mjs';
import { auth, db } from "../firebase.js"; 



async function fillInForm(email, companyId, location =  "Green street"){
   await userEvent.type(screen.getByPlaceholderText(/business name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/company id/i), companyId);
      await userEvent.type(screen.getByPlaceholderText(/first name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/last name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/email address/i), email);
      await userEvent.type(screen.getByPlaceholderText(/business address/i),location);
      await userEvent.type(screen.getByPlaceholderText(/postcode/i), "E1 38CD");
      await userEvent.type(screen.getByPlaceholderText(/phone number/i), "07889546333");
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), "Password123");
      await userEvent.type(screen.getByPlaceholderText(/^confirm password$/i), "Password123");
      await userEvent.selectOptions(screen.getByRole('combobox'), "Services");

}


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




  
  })


 afterEach(() => {
  jest.clearAllMocks(); 
  jest.resetAllMocks();
});
    



 

it("Displays an error when the email and company id don't match records of registered eneteprises", async()=>{
  
   
     render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
    

      
    await fillInForm("wrong@mail.com", "wrong");
    await submit()
    const error =  await screen.findByTestId('signup-error');
    expect(error).toHaveTextContent('No record of your company has been found. Try again.');
 
  
  })

  it('Shows successful account registration message on email verification', async ()=>{
 auth.currentUser = { uid: '123', email: 'test_1@mail.com', emailVerified: false };

  reload.mockImplementation(async (user) => { user.emailVerified = true; });
      render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
 
        
 await fillInForm("test_1@mail.com", "RF238E2");

 await submit()
 expect(await screen.findByText('We sent you an email verification link to your email address. Click on the button below once verification has been completed.')).toBeInTheDocument();   
await confirmEmail()  
 expect(await screen.findByText('Account created successfully!')).toBeInTheDocument();   


})



it('Catches an error on rejected reload', async()=>{
   auth.currentUser = { uid: '123', email: 'test_1@mail.com', emailVerified: false };

  const errSpy = jest.spyOn(console, 'error').mockImplementation();
  reload.mockRejectedValueOnce((new Error('user is undefined')))
    render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);


        await fillInForm("test_1@mail.com", "RF238E2");
        await submit()
        await confirmEmail()  
        act(()=>{
          
        })

     await waitFor( () => {
      expect(errSpy).toHaveBeenCalledWith(
       'Error happened:', 'user is undefined'
       );

  })
})






it('Logs exception error on unresolved promise from fetchData', async()=>{
  // const errSpy = jest.spyOn(console, 'error').mockImplementation();

  const errorSpy = jest.spyOn(console, 'error')
  fetchData.mockRejectedValue(new Error('Data cloud not be fetched'))
   render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
        await fillInForm("test_1@mail.com", "RF238E2");
        await submit()
       

     await waitFor(async () => {
      expect(errorSpy).toHaveBeenCalledWith( 'Form could not be submitted:', 'Data cloud not be fetched');

  })



})



it('Displays error UI on unverified email', async()=>{

  reload.mockImplementation(async (user) => { user.emailVerified = false; });
  //  setDoc.mockResolvedValue({businessName:'test'});
  //  doc.mockReturnValue({});   

    render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
       
  await fillInForm('test_1@mail.com', 'RF238E2');
  await submit();
  await confirmEmail();

  expect(await screen.findByText('Email address could not be verified')).toBeInTheDocument();   



})


})