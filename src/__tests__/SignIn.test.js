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
  getDoc: jest.fn(),
  doc:jest.fn()
}))

jest.mock('../Forms/UserAuthContext', () => ({
  UserAuthContext: jest.fn(), 
}));
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


async function fillInForm(email, password){

      await userEvent.type(screen.getByPlaceholderText(/email address/i), email);
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), password);


}

async function submit(){
   await userEvent.click(screen.getByTestId('submit-btn'));

}
describe('Sign up form for enterprises', ()=>{
  beforeEach(()=>{

      UserAuthContext.mockReturnValue({
    setUser: jest.fn(), 
  });

    signInWithEmailAndPassword.mockResolvedValue({
        email:'test_user',
        password: '123'
    })
  });
    

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();

});
 

it('signUpError state change', async()=>{
  
   
     render(
    <MemoryRouter>
      <SignIn/>
    </MemoryRouter>);
            
        await fillInForm('wrong', 'wrong')
        await submit()
        
        expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  })

 
})