jest.mock('firebase/firestore', ()=>({
  setDoc: jest.fn(),
  doc: jest.fn()
}))


jest.mock('../Forms/UserAuthContext', () => ({
  UserAuthContext: jest.fn(), 
}));
jest.mock('../firebase.js', ()=>({
  auth: jest.fn()
}));
jest.mock("../utilities/fetchData");
jest.mock("firebase/auth", () => ({

  createUserWithEmailAndPassword: jest.fn(),
 
}));




import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { UserAuthContext } from "../Forms/UserAuthContext";
import SignUpArtist from "../Artists/SignUpArtist";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {  fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SignIn from "../Forms/SignIn";

 async function submit(){
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

}
async function fillInForm(email, password, confirmPassword){

      await userEvent.type(screen.getByPlaceholderText(/first name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/last name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/email address/i), email);
      await userEvent.type(screen.getByPlaceholderText(/home address/i), "Green street");
      await userEvent.type(screen.getByPlaceholderText(/postcode/i), "E1 38CD");
      await userEvent.type(screen.getByPlaceholderText(/phone number/i), "07889546333");
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), password);
      await userEvent.type(screen.getByPlaceholderText(/^confirm password$/i), confirmPassword);

}

function MockSignIn(){
    return (
        <div>
            <p>Sign In</p>
        </div>
    )
}

describe('Artis sign-up form', ()=>{
 

    beforeEach(()=>{
        createUserWithEmailAndPassword.mockResolvedValue({user:{uid:'123', email:'artist_testl@mail.com'}})
        setDoc.mockResolvedValue({firstName:'test', lastName: 'test', email: 'artist_testl@mail.com', links:['www.test.com', 'www.test2.com']})
        UserAuthContext.mockReturnValue({
        setUser: jest.fn(), 
    });
    })

    it('Shows error when email format is wrong', async ()=>{

        render(
            <MemoryRouter>
                <SignUpArtist/>
            </MemoryRouter>
        )
     await fillInForm('wrong', '123password', '123password')
     
      await submit()
     expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument(); 

    })

      it('Shows error when passwords do not match', async ()=>{

        render(
            <MemoryRouter>
                <SignUpArtist/>
            </MemoryRouter>
        )
    await userEvent.type(screen.getByPlaceholderText(/^confirm password$/i), 'wrong1111');
    await fillInForm('test@mail.com', 'correct1234', 'wrong1111')
      await submit()

     expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument(); 

    })

    it('Allows to type into a text area on click', async ()=>{
  render(
            <MemoryRouter>
                <SignUpArtist/>
            </MemoryRouter>
        )
        
        await userEvent.click(screen.getByTestId('btn'))
        expect (await screen.getByTestId('txt-area')).toBeInTheDocument()
       await userEvent.type(screen.getByTestId('txt-area'), 'www.sample1.com')
           expect (await screen.getByTestId('txt-area')).toHaveValue('www.sample1.com')

    })


    it('Navigates to sign in page', async ()=>{
    render(
            <MemoryRouter initialEntries={['/artist_signup']}>
                <Routes>
                    <Route path='/artist_signup' element={<SignUpArtist/>}/>
                     <Route path='/signin' element={<MockSignIn/>}/>
                </Routes>
            </MemoryRouter>
        )
    
     
            
            await fillInForm('email@test.com', '1234password', '1234password')
      


         await submit()
     
          expect(await screen.findByText('Sign In')).toBeInTheDocument(); 

    })



      it('Logs an error message when user account already exists', async ()=>{
        createUserWithEmailAndPassword.mockRejectedValue((new Error('email in use')))
          const errSpy = jest.spyOn(console, 'error').mockImplementation();

       render(
            <MemoryRouter>
                <SignUpArtist/>
            </MemoryRouter>
        )
       
            
       await fillInForm('email@test.com', '1234password', '1234password')
    
      await submit()

      await waitFor(()=>{
       expect(errSpy).toHaveBeenCalledWith(
    'Artist account could not be created:', 'email in use'
  );
      })
 
  errSpy.mockRestore();

    })
})