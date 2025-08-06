import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../Components/InputField';
import { UserAuthContext } from './UserAuthContext';
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
function SignIn() {
    const {setUser} = UserAuthContext()
    const {handleSubmit, register, setError, reset, clearErrors, formState: {errors}} = useForm({shouldUseNativeValidation: false,  mode: "onTouched",})
    const navigate = useNavigate()
    const onSubmit = async (data) => {
         try {
        
        await setPersistence(auth, browserSessionPersistence)

        const  userCredential = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );
         
    const user = userCredential.user;

    const artistDoc = await getDoc(doc(db, 'artists', user.uid));
    const businessDoc = await getDoc(doc(db, 'businesses', user.uid));

    let userData = null;

    if (artistDoc.exists()) {
      userData = artistDoc.data();
      setUser({ ...userData, id: user.uid });
      navigate('/artist_dashboard');
    } else if (businessDoc.exists()) {
      userData = businessDoc.data();
      setUser({ ...userData, id: user.uid });

      navigate('/business_dashboard');
    }  else  if (user.email === 'admin1234@test.com'){
        navigate('/admin')
      }
    console.log(user)
    
  
    
  } catch (err) {
    
     
     
     // custom firebase authentication error messages 
     let customMessage = ''
     switch (err.code){
       case "auth/user-not-found":
         customMessage = "No account found with this email.";
         break;
         case "auth/wrong-password":
           customMessage = "Incorrect password.";
           break;
           case "auth/too-many-requests":
             customMessage = "Too many attempts. Please try again later.";
             break;
             case "auth/invalid-email":
               customMessage = "Email address is invalid.";
               break;
               case 'auth/invalid-credential':
                 customMessage = "Email or password is incorrect.";
                 break;
                 default:
                   customMessage = err.message || "Signin failed.";
                  }
                  
                  reset({ email: '', password: '' }, { keepErrors: true }); 
                  setError("firebase", {
                    type: "manual",
                    message: customMessage,
                  });
                  
                  console.log(data)
                  
                  
  }
      };
    

  return (
    <div className=" flex flex-col p-4 justify-center text-center items-center">


<div className=' flex  w-[30rem] justify-center items-center'>
    <form  data-testid="sign-in" className='flex-col w-[90vw] flex items-left p-4 justify-center text-center '  onSubmit={handleSubmit(onSubmit)}>
      
          <legend className="text-xl text-center font-semibold mb-4">Sign In</legend>
  {errors.firebase ? (
    <p className="text-red-500 text-sm py-2">{errors.firebase.message}</p>
  ) : null}
         
   
<InputField
            name="email"
            placeholder="email address"
            type="email"
            register={register}
            validationRules={{
              required: "Enter your email address",
              validate: (value) =>
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Please enter a valid email address",
            }}
            error={errors.email}
            onChange={()=> clearErrors('firebase')}
          />

      <InputField
  name="password"
  placeholder="password"
  type="password"
  register={register}
  validationRules={{
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long',
    },
  }}
  error={errors.password}
/>


    <button className='submit-btn'>Submit</button>
  </form>
</div>

</div>
  );

}

export default SignIn;