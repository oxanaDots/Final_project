import React from 'react';
import { useRef, useState } from 'react';
import { UserAuthContext } from '../Forms/UserAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowUpFromBracket, faImage, faTrash} from '@fortawesome/free-solid-svg-icons';
// import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks'

function ArtistDashboard() {
  const {user}= UserAuthContext()
  const [files, setFiles]=useState([])

const fileInput = useRef()

function handleClick(){
fileInput.current.click()
}

function deleteFile(inx){
  setFiles(files => files.filter((_, index)=> index !== inx))
}
function addFiles(event){

  const selectedFiles = Array.from(event.target.files)
  setFiles((file)=> [...file, ...selectedFiles])
}
  return (
    <div className='flex  items-center flex-col h-full justify-between'>
      <section className='flex  w-[80vw] justify-between py-4 pt-16 border-b border-ternary-dark'>
       <div className=' '><h2 className='font-semibold text-primary-dark text-2xl'>Welcome, {user.firstName} {user.lastName}!</h2></div> 
      </section>
<section className='grid grid-cols-[30%_50%] w-[80vw] gap-16 py-10 justify-center'>
  <div className='flex flex-col  border-b'>
    <h2 className='pb-4 font-semibold'>Current art hosts:</h2>
    <div className='flex justify-between text-xs py-2 px-4 bg-ternary-light'>
      <p >Art Host1</p>
      <p>Location </p>
      </div>
  </div>
  <div className='flex flex-col'>
    <h2 className='pb-4 font-semibold' >Next steps:</h2>
      <p className='text-xs py-2' >Upload your art and receive your exhibition schedule on the spot:</p>
    <div className='grid grid-cols-[50%_50%] gap-10 justify-between text-xs py-2 px-4 '>
     <div className='border border-ternary-medium border-dashed flex flex-col rounded-md col-span-1 justify-center items-center text-center py-6 bg-ternary-light'>
   <FontAwesomeIcon className='text-2xl text-ternary-dark self-center text-center pb-8 pt-4' icon={faArrowUpFromBracket} />
   <button onClick={handleClick} className='text-center py-2 my-2 bg-primary-dark text-secondary-light flex flex-col px-4 rounded-full w-auto self-center' >Browse Files</button>
   <p className='text-center py-2 text-ternary-medium'>Max size: 200Mb</p>
     </div>
     <input
        type="file"
        ref={fileInput}
        style={{ display: 'none' }}
        onChange={addFiles}
      multiple
        />
     {files.length ? 
       <div className='  col-2  border-b'>
      <h2 className='font-semibold pb-4'>Uploaded files:</h2>
        <div className=' overflow-y-scroll h-[23vh] flex-col justify-center px-4'>
              
        {files && files.map((file, index)=>(
      <div className='flex justify-between items-center'>
          <div className='flex items-center py-2 text-[0.7rem] gap-2'>
            <FontAwesomeIcon className='text-ternary-medium' icon={faImage}/>
             <p>{file.name}</p>

          </div>
          <FontAwesomeIcon onClick={()=> deleteFile(index)} className='text-red-600'icon={faTrash}/>
        </div>
      ))}
        </div>
     </div>
     : null}
   

      </div>
  </div>
</section>

    </div>
  );
}

export default ArtistDashboard;