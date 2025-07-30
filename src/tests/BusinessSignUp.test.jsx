import React from 'react';
jest.mock('firebase/app', () => {
  return {
    auth: jest.fn(),
    currentUser:{
   email: "test@mail.com",
   uid: "123"
    }
  };
});




jest.mock("../firebase.js");
jest.mock("../utilities/fetchData", () => ({ fetchData: jest.fn() }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn()
}));
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { fetchData } from "../utilities/fetchData";
import BusinessSignup from "../Business/BusinessSignUp";
import * as firebaseAuth from "firebase/auth";

async function fillInForm(){
   await userEvent.type(screen.getByPlaceholderText(/business name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/company id/i), "RF238E2");
      await userEvent.type(screen.getByPlaceholderText(/first name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/last name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/email address/i), "test@mail.com");
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
 
    firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        uid:   "123",
        email: "test@mail.com"
      }
    });
  })

   afterEach(() => {
    jest.restoreAllMocks();
  });
    
    it('form fields', async ()=>{
    render(
    <MemoryRouter>
      <BusinessSignup />
    </MemoryRouter>);

   
await fillInForm();
   
    expect(screen.getByPlaceholderText(/business name/i).value).toBe("test");
    expect(screen.getByPlaceholderText(/company id/i).value).toBe("RF238E2");
    })


    it('call companies details API', async()=> {
       render(
    <MemoryRouter>
      <BusinessSignup />
    </MemoryRouter>);
  

  await fillInForm();

      fetchData.mockImplementation(async()=> {
        return [
          {"email": "test_1@mail.com", "companyID": "RF234E2"}
        ]
      })
      // simulate user clicking submit button
      await submit();
      await waitFor(()=>{
        expect(fetchData).toHaveBeenCalled()
    })
})

 

it(' signUpError state change', async()=>{
  
 fetchData.mockImplementation(async()=> {
        return [
          {email: "test_2@mail.com", companyID: "YI294P7"}
        ]
      })
  
 
     render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
    

      await fillInForm();
      await submit();
     
      await waitFor(async ()=>{
        
      const error =  await screen.findByTestId('signup-error');
       expect(fetchData).toHaveBeenCalled();
       
       expect(error).toHaveTextContent('No record of your company has been found. Try again.');

    })
  })
})