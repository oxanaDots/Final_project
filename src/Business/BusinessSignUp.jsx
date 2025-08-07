import React, { useState } from 'react';
import InputField from '../Components/InputField';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import services from '../services.json'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js"; 
import { fetchData } from '../utilities/fetchData.js';
import { geoCode } from '../utilities/geoCode.mjs';
function BusinessSignup() {
  const {handleSubmit, register, isSubmitting, watch,  formState: {errors}} = useForm({shouldUseNativeValidation: false})
  
  const [signUpError, setSignUpError] = useState('')
  const [geoCodeValue, setGeoCode] = useState( '')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()


  async function onSubmit (data) {

  try {
    // const enterprisesData = await fetchData('https://final-project-red-delta.vercel.app/api/enterprises')
     const enterprisesData = await fetchData('http://localhost:3001/api/enterprises')

   
   const geoCodedLoc = await geoCode(`${data.location}, ${data.postcode}`)
   console.log(geoCodedLoc)
   const foundEnterprise = enterprisesData && enterprisesData.filter(item => item.email === data.email && item.companyID === data.companyID)
   console.log(foundEnterprise)
     console.log(data.location, data.postcode)

    !geoCodedLoc && setGeoCode( 'Wrong address')
      foundEnterprise.length === 0 &&  setSignUpError('No record of your company has been found. Try again.')
   
    if (geoCodedLoc && foundEnterprise.length > 0){

      const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
       const business = userCredential.user;

       await setDoc(doc(db, "businesses", business.uid), {
       businessName: data.businessName,
       firstName: data.firstName,
       lastName: data.lastName,
       email: data.email,
       location: data.location,
       postcode: data.postcode,
       phoneNumber: data.phoneNumber,
       geoLocation:  geoCodedLoc,
       business_type: data.business_type,
       role: 'business',
       createdAt: new Date()
      });
      console.log("Business user created and stored in Firestore");
      setSubmitted(true)
    } 
  
  } catch (error) {
    console.error("Error during signup:", error.message);
    
  }
};


  
  return (
    <div className=" flex flex-col  p-4 justify-center text-center items-center">


 <div className=' flex  w-[40rem] justify-center items-center'>
      {!submitted ? <form 
        onAnimationStart={e => {
      if (e.animationName === 'onAutoFillStart') {
        const input = e.target;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      }
    }}
      data-testid="signupForm" className=' flex flex-col w-[90vw] items-left p-4 justify-center text-center '  onSubmit={handleSubmit(onSubmit)}>
            <legend className="text-xl text-center font-semibold mb-4">Create an Account</legend>
                { signUpError.length > 0 && 
              
                <p data-testid="signup-error"  className='text-red-500 flex mt-4 justify-center rounded-md text-xs bg-red-50 border-red-400 self  text-center border py-4'>{signUpError}</p>
              
                }
                {geoCodeValue === 'Wrong address' && <p className='text-red-500 flex mb-4 mt-2 justify-center rounded-md text-xs bg-red-50 border-red-400 self  text-center border py-4'>Make sure you entered correct location.</p>}

      

            <InputField
              name="businessName"
              placeholder="business name"
              register={register}
              validationRules={{
                required: "Enter the name of your business",
                validate: (value) =>
                  /^[a-zA-Z]+$/.test(value) || "Your input can only contain alpahbetic letters",
              }}
              error={errors.businessName}
            />

          
          
            <div className=' w-100 flex justify-between w-full gap-4 '>
          
            <InputField
              name="firstName"
              placeholder="first name"
              register={register}
              validationRules={{
                required: "Enter your first name",
                validate: (value) =>
                  /^[a-zA-Z]+$/.test(value) || "Your input can only contain alpahbetic letters",
              }}
              error={errors.firstName}
            />
              <InputField
              name="lastName"
              placeholder="last name"
              register={register}
              validationRules={{
                required: "Enter your last name",
                validate: (value) =>
                  /^[a-zA-Z]+$/.test(value) || "Your input can only contain alpahbetic letters",
              }}
              error={errors.lastName}
            
            />
  </div>
    <div className=' w-100 flex justify-between w-full gap-4 '>
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
                registerError={signUpError.length > 0&&true}
            />
                <InputField
              name="companyID"
              placeholder="company ID"
              register={register}
              validationRules={{
                required: "Enter your company ID",
              }}
              error={errors.companyID}
                  registerError={signUpError.length > 0 && true}
            />
          </div>   
  <div className=' w-100 flex justify-between w-full gap-4 '>
        <InputField
          name="location"
          placeholder="business address"
          register={register}
          validationRules={{ required: 'Business address is required' }}
          error={errors.location}
            registerError={geoCodeValue ==='Wrong address' &&true}

        />
        <InputField
          name="postcode"
          placeholder="postcode"
          register={register}
          validationRules={{ required: 'Postcode is required',
              validate: (value) =>
                  /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s\d{1,2}[A-Za-z]{2}$/.test(value) || "Please enter a valid postcode",
              }}
          error={errors.postcode}
            registerError={geoCodeValue ==='Wrong address' &&true}

        />
  </div>
  <InputField
          name="phoneNumber"
          placeholder="phone number"
          register={register}
          validationRules={{ required: 'Phone number is required',
              
              }}
          error={errors.phoneNumber}
        />
            <InputField
            type='select'
            options={services}
          name="business_type"
          placeholder="type of business you own"
          register={register}
          validationRules={{ required: 'Business type is required',
              
              }}
          error={errors.business_type}
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
  
  <InputField
    name="confirmPassword"
    placeholder="confirm password"
    type="password"
    register={register}
    validationRules={{
      required: 'Please confirm your password',
      validate: (value) =>
        value === watch('password') || 'Passwords do not match',
    }}
    error={errors.confirmPassword}
  />
  



  
      <button type='submit'  data-testid="submit" className='submit-btn'>{isSubmitting? "Checking your company details":'Submit'}</button>
    </form>:
      <div className='flex align-middle pt-20 '>
        <div className='p-10 border  border-primary-dark rounded-md'>  
      <h2 className='text-green-600 font-semibold text-2xl py-6'>Account created successfully!</h2>
      <p className='text-xs'>Email confirmation has been sent to your email address with the next steps.</p>
       <Link to='/'>
        <button  className='main-btn'>Return Home</button>
       </Link>
        </div>
  </div>
    }
  </div>


    </div>
      );
  
}

export default BusinessSignup;