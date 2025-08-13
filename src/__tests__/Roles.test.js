
jest.mock('../firebase')
jest.mock('../utilities/geoCode.mjs', () => ({
  geoCode: jest.fn(async () => {
    return {lat: 0.0, lng: 0.9};
  }),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn(),
  reload: jest.fn()
}));
import '@testing-library/jest-dom';
import Roles from "../Forms/Roles";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SignUpArtist from "../Artists/SignUpArtist";
import BusinessSignup from "../Business/BusinessSignUp";

describe('Sign up form for enterprises', ()=>{
 

it('Click on "artist" button and navigate to artist sign up form', async()=>{
  
   
     render(
    <MemoryRouter initialEntries={['/roles']}>
        <Routes>
            <Route path='/roles' element={<Roles/>}/>
              <Route path='/artist_signup' element={<SignUpArtist/>}/>
               <Route path='/business_signup' element={<BusinessSignup/>}/>
        </Routes>
     
    </MemoryRouter>);
            
    fireEvent.click(screen.getByTestId('artist-btn'))
     expect(await screen.findByText("Create an Account")).toBeInTheDocument();   
    


  })

  it('Click on "business" button and navigate to business sign up form', async()=>{
  
   
     render(
    <MemoryRouter initialEntries={['/roles']}>
        <Routes>
            <Route path='/roles' element={<Roles/>}/>
              <Route path='/artist_signup' element={<SignUpArtist/>}/>
               <Route path='/business_signup' element={<BusinessSignup/>}/>
        </Routes>
     
    </MemoryRouter>);
            
    fireEvent.click(screen.getByTestId('business-btn'))
     expect(await screen.findByText("Create an Account")).toBeInTheDocument();   
    

  })
})