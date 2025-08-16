
// jest.mock("../Forms/UserAuthContext", ()=>({
//     UserAuthContext:{
//         user: jest.fn(),
//         setUser: jest.fn()
//     }
// }))
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {  render, screen, renderHook, act } from "@testing-library/react";
import { UserAuthContext, AuthContext, AuthProvider } from "../Forms/UserAuthContext";


function Helper(){
    const {user, setUser }= UserAuthContext()
    return(
        <div>
            <p data-testid='name'>{user? user.name : null}</p>
            <button onClick={()=> setUser({uid:'123'})}>Submit</button>
        </div>
    )

}
describe('UserAuthContext', ()=>{
   
    it ('Reads user from UserAuthContext', async()=>{

     const setUser = jest.fn()
    const value = {user:{name:'test'}, setUser}
        render(
             <AuthContext.Provider value={value}>
              <Helper/>

           </AuthContext.Provider>
        )
         expect(screen.getByTestId("name")).toHaveTextContent("test");



    })


    it ('Updates user state on click', async()=>{

     const setUser = jest.fn()
    const value = {user:{name:'test'}, setUser}
        render(
             <AuthContext.Provider value={value}>
              <Helper/>

           </AuthContext.Provider>
        )
         await userEvent.click(screen.getByRole('button', {name:'Submit'}))
        expect(setUser).toHaveBeenCalledWith({ uid:'123'});



    })

       it ('Sets user to null', async()=>{
    // render a mock component or components inside AuthProvider so the content of a component
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
// run AuthProvider in this test environment and returns result
  const { result } = renderHook(() => UserAuthContext(), { wrapper });
console.log('result', result)

  act(() => result.current.setUser(null));
  expect(result.current.user).toBeNull();
});



 
})