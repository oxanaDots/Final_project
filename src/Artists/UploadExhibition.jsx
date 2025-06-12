import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {db, storage} from '../firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';

function UploadExhibition() {
    const {files} = useOutletContext()
    const {user} = useOutletContext()
    const [uploadStatus, setUploadStatus] = useState(false)
    const [uploaded, setUploaded ] = useState(false)
    const [exhibitionDetails, setExhibitionDetails] = useState({
        title:'',
        descr:'',
        medium:''
    })
    function handleChange(e){
        const { name, value } = e.target;
         setExhibitionDetails(prev => ({ ...prev, [name]: value }));
    }

    async function handleUpload(){
        try{
            setUploadStatus(true)
             const uploadedImageURLs = await Promise.all(
            files.map(async (file) => {
          const storageRef = ref(storage, `exhibitions/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );
         await addDoc(collection(db, "exhibitions"), {
        ...exhibitionDetails,
        images: uploadedImageURLs,
        artists_id: user.id,
        createdAt: new Date()
      });

        } catch(err){
            console.error(err)
        }finally{
            setUploadStatus(false)
            setUploaded(true)
        }
    }

    async function calcDate(){

    }

  return (
<>
    {!uploaded ?
        ( <div className='grid grid-cols-[60%_40%] gap-8 mt-10  rounded-sm  justify-center  w-[70vw] '>
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
      <button onClick={()=> handleUpload()} className='submit-btn'>{uploadStatus ? 'Uploading...': 'Upload'}</button>
      </div>
     </section>
    </div> ): 
    <div className='flex p-8 flex-col bg-ternary-light mt-10 items-center'>
        <FontAwesomeIcon className='text-2xl pb-4 text-emerald-600' icon={faCheck}/>
        <h2 className='font-semibold'>Your files have been uploaded!</h2>
        <p className='text-xs py-8'>Your exhibition will take place on</p>
        </div>}
    </>
  );
}

export default UploadExhibition;