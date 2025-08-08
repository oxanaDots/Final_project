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

async function fillInForm(){

      await userEvent.type(screen.getByPlaceholderText(/email address/i), email);
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), "Password123");


}

async function submit(){
   await userEvent.click(screen.getByTestId('submit-btn'));

}
describe('Sign up form for enterprises', ()=>{
  beforeEach(()=>{

  });
    

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();

});
 

it('signUpError state change', async()=>{
  
   
     render(
    <MemoryRouter>
      <BusinessSignup/>
    </MemoryRouter>);
    

 
  
  })

 
})