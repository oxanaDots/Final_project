import { useArtistForm } from './ArtistFormContext'
import InputField from '../Components/InputField';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpArtist() {
    const navigate = useNavigate()
    const {
         setArtistFormData
    } = useArtistForm()
const [but, updateButt] = useState(false)
const [links, setLinks] = useState([])

    const {handleSubmit, register, watch, formState: {errors}} = useForm({shouldUseNativeValidation: false})

    function onSubmit(data){
           const linksArray = links.length > 0 && links
        .split(',')
        .map(link => link.trim())
        .filter(link => link !== '');
        const updatedData = {
            ...data,
             links: linksArray.length > 0 ? linksArray : [],
             role: 'artist'
          };        
          setArtistFormData(updatedData);

          fetch('http://localhost:5001/api/artist_signup', {
             method: 'POST',
              headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(updatedData),
             credentials: 'include', 
          })
            .then(async (res) => {
              const response = await res.json();
              if (res.ok) {
                console.log('✅ Artist registered:', response);
                navigate('/artist_dashboard');
              } else {
                console.error(' Signup error:', response.error || response);
              }
            })
            .catch((err) => {
              console.error('Network error:', err);
            });
    }
 
    

  return (
    <div className=" flex flex-col p-4 justify-center text-center items-center">


<div className=' flex  w-[40rem] justify-center items-center'>
    <form className=' flex flex-col w-[90vw] flex items-left p-4 justify-center text-center '  onSubmit={handleSubmit(onSubmit)}>
          <legend className="text-xl text-center font-semibold mb-4">Create an Account</legend>

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
        placeholder="home address"
        register={register}
        validationRules={{ required: 'Home address is required' }}
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
        validationRules={{ required: 'Postcode is required',
           
            }}
        error={errors.phoneNumber}
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
  type="confirmPassword"
  register={register}
  validationRules={{
    required: 'Please confirm your password',
    validate: (value) =>
      value === watch('password') || 'Passwords do not match',
  }}
  error={errors.confirmPassword}
/>

<div className='flex flex-col w-full  gap-2 pt-2  self-left cursor-pointer'>
   <div onClick={()=> updateButt (prev=> ! prev) }  className='flex  justify-left items-center gap-5  self-left '>
        <span >{but ? '-':'+'}</span>
        <p className='text-xs py-1'>Add comma separated links to your social media:</p>
        </div>
        {but && <textarea  onChange={(e) => setLinks(e.target.value)} className='bg-ternary-light w-full px-3 text-sm py-[0.7rem] '></textarea>  }
      </div>
    <button className='submit-btn'>Submit</button>
  </form>
</div>
</div>
  );
}

export default SignUpArtist;