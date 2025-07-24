import React, { useState } from 'react';
import InputField from '../Components/InputField';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import services from '../services.json'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js"; 
import { fetchData } from '../utilities/fetchData.js';

function BusinessSignup() {
  const {handleSubmit, register, isSubmitting, watch, formState: {errors}} = useForm({shouldUseNativeValidation: false})
  
  const [signUpError, setSignUpError] = useState('')
  const navigate = useNavigate()


  async function onSubmit (data) {


  try {
    const enterprisesData = await fetchData()
      const newData = {
    ...data,
    role: "business",
  };

  

      const userCredential = await createUserWithEmailAndPassword(
      auth,
      newData.email,
      newData.password
    );
    const business = userCredential.user;

    
     

   const foundEnterprise = enterprisesData && enterprisesData.filter(item => item.emailAdress === newData.email && item.companyID === newData.companyID)

   if (foundEnterprise.length !== 0){

     await setDoc(doc(db, "businesses", business.uid), {
       // this info will be stored on Firestore database
       businessName: newData.businessName,
       firstName: newData.firstName,
       lastName: newData.lastName,
       email: newData.email,
       location: newData.location,
       postcode: newData.postcode,
       phoneNumber: newData.phoneNumber,
       business_type: newData.business_type,
       role: newData.role,
       createdAt: new Date()
      });
      console.log("Business user created and stored in Firestore");
      navigate("/signin");
    } else{
        setSignUpError('No record of your company has been found. Try again.')
    }

  } catch (error) {
    console.error("Error during signup:", error.message);
    
  }
};


  
  return (
    <div className=" flex flex-col  p-4 justify-center text-center items-center">


    <div className=' flex  w-[40rem] justify-center items-center'>
        <form data-testid="signupForm" className=' flex flex-col w-[90vw] items-left p-4 justify-center text-center '  onSubmit={handleSubmit(onSubmit)}>
              <legend className="text-xl text-center font-semibold mb-4">Create an Account</legend>
                 { signUpError.length > 0 && 
                
                 <p className='text-red-500 flex my-4 justify-center rounded-md text-xs bg-red-50 border-red-400 self  text-center border py-4'>{signUpError}</p>
                
                 }

        <div className=' w-100 flex justify-between w-full gap-4 '>

              <InputField
                name="businessName"
                placeholder="business name"
                register={register}
                validationRules={{
                  required: "Enter your the name of your business",
                  validate: (value) =>
                    /^[a-zA-Z]+$/.test(value) || "Your input can only contain alpahbetic letters",
                }}
                error={errors.businessName}
              />

                <InputField
                name="companyID"
                placeholder="company ID"
                register={register}
                validationRules={{
                  required: "Enter your company ID",
                }}
                error={errors.companyID}
              />
              </div>
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
              />
    <div className=' w-100 flex justify-between w-full gap-4 '>
          <InputField
            name="location"
            placeholder="business address"
            register={register}
            validationRules={{ required: 'Business address is required' }}
            error={errors.location}
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
    



   
        <button type='submit' className='submit-btn'>{isSubmitting? "Checking your company details":'Submit'}</button>
      </form>
    </div>
    </div>
      );
  
}

export default BusinessSignup;