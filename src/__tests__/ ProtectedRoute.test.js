jest.mock("../Forms/UserAuthContext", ()=>({
     UserAuthContext: jest.fn()
}))
import '@testing-library/jest-dom';

import { render, screen } from "@testing-library/react";
import { UserAuthContext } from "../Forms/UserAuthContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../Forms/ProtectedRoute";

function renderHelper(){
       render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route path="/secret"  element={
            <ProtectedRoute>
              <div>Artist Dashboard</div>
               <div>Admin Dashboard</div>
            </ProtectedRoute>}
        />
        <Route path="/signin" element={<div>Sign In</div>} />
      </Routes>
    </MemoryRouter>
  );
}
describe('Protected route', ()=>{

    
    it('Redirects to a sign in page when one of the protected routes is accessed', async()=>{
    UserAuthContext.mockReturnValue({user: null});
     renderHelper()
   
  expect(await screen.findByText('Sign In')).toBeInTheDocument();


  })

     it('Redirects to an Artist Dashboard if the user is signed in', async()=>{
    UserAuthContext.mockReturnValue({user: true});
     renderHelper()
   
  expect(await screen.findByText('Artist Dashboard')).toBeInTheDocument();


  })

})
