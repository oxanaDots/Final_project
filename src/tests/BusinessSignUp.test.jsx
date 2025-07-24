import BusinessSignup from "../Business/BusinessSignUp";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
// mock data returned by fetchData fucntion
jest.mock('../utilities/fetchData');
import { fetchData } from '../utilities/fetchData.js';
jest.mock('../firebase.js');
jest.mock('firebase/auth');

async function fillInForm(){
   await userEvent.type(screen.getByPlaceholderText(/business name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/company id/i), "RF234E2");
      await userEvent.type(screen.getByPlaceholderText(/first name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/last name/i), "test");
      await userEvent.type(screen.getByPlaceholderText(/email address/i), "test_1@mail.com");
      await userEvent.type(screen.getByPlaceholderText(/business address/i), "Green street");
      await userEvent.type(screen.getByPlaceholderText(/postcode/i), "E1 3CD");
      await userEvent.type(screen.getByPlaceholderText(/phone number/i), "07889546333");
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), "Password123");
      await userEvent.type(screen.getByPlaceholderText(/^confirm password$/i), "Password123");
      await userEvent.selectOptions(screen.getByRole('combobox'), "Services");

}

async function submit(){
   await userEvent.click(screen.getByRole('button', { name: /submit/i }));

}
describe('Sign up form for enterprises', ()=>{
    
    it('form fields', async ()=>{
    render(
    <MemoryRouter>
      <BusinessSignup />
    </MemoryRouter>);

   
await fillInForm();
   
    expect(screen.getByPlaceholderText(/business name/i).value).toBe("test");
    expect(screen.getByPlaceholderText(/company id/i).value).toBe("RF234E2");
    })


    it('call companies details API', async()=> {
       render(
    <MemoryRouter>
      <BusinessSignup />
    </MemoryRouter>);
  

  await fillInForm();

      fetchData.mockImplementation(async()=> {
        return [
          {"emailAdress": "test_1@mail.com", "companyID": "RF234E2"}
        ]
      })
      // simulate user clicking submit button
      await submit();
      await waitFor(()=>{
        expect(fetchData).toHaveBeenCalled()
    })
})

it('check signUpError state change', async()=>{

 
     render(
    <MemoryRouter>
      <BusinessSignup />
    </MemoryRouter>);
    fetchData.mockImplementation(async()=> {
        return [
          {"emailAdress": "test_1@mail.com", "companyID": "RF234E2"}
        ]
      })

      await fillInForm({
        email:'wrong_email@mail.com',
        companyID:  'wrong'
      });

      await submit();
      await waitFor(()=>{
       expect(fetchData).toHaveBeenCalled();
       expect(screen.getByText(/No record of your company has been found/i)).toBeInTheDocument();

    })


})
})