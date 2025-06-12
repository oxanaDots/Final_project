import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function UploadExhibition() {
    const {files} = useOutletContext()
    const {user} = useOutletContext()
    const [exhibitionDetails, setExhibitionDetails] = useState({
        title:'',
        descr:'',
        medium:''
    })
    function handleChange(e){
        const { name, value } = e.target;
         setExhibitionDetails(prev => ({ ...prev, [name]: value }));
    }
console.log(user)
  return (
    <div className='grid grid-cols-[60%_40%] gap-8 mt-10  rounded-sm  justify-center  w-[70vw] '>
     <section className='grid grid-cols-4 grid-rows-4 justify-center   col-1 gap-4 px-6 py-6 '>
        {files.map((file, index)=> (
            <div className='grid w-full h-full aspect-square overflow-hidden  justify-center place-self-center rounded-sm border ' key={index}>
                <img
                className='object-cover w-full h-full border-ternary-medium'
                src={URL.createObjectURL(file)}
                />
            </div>
        ))}
     </section>
     <section className='col-2 px-6 py-6 '>
      <div className='flex flex-col gap-4'>
        <h2 className='font-semibold'>Add exhibition details:</h2>
      <input className=' flex w-full border px-3 text-sm py-[0.7rem]' name='title' value={exhibitionDetails.title} onChange={handleChange} placeholder='exhibition name'/>
     <input className=' flex w-full border px-3 text-sm py-[0.7rem]' name='medium' value={exhibitionDetails.medium} onChange={handleChange} placeholder='art medium'/>

      <textarea className=' flex h-[15rem] w-full border px-3 text-sm py-[0.7rem]' name='descr' value={exhibitionDetails.descr} onChange={handleChange} placeholder='add description'/>
      <button className='submit-btn'>Upload</button>
      </div>
     </section>
    </div>
  );
}

export default UploadExhibition;