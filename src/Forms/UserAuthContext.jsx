import React, { createContext, useContext, useState, 
  // useEffect 
} from 'react';
// import { auth } from '../firebase';
// import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
export const AuthContext = createContext()
export const UserAuthContext=()=> useContext(AuthContext)
export const AuthProvider = ({children})=>{
  const [user, setUser] = useState(null)
  return (
   <AuthContext.Provider value={{user, setUser}}>
    {children}
   </AuthContext.Provider>
  );

}
