import React, { useEffect, useMemo } from 'react';
import { useRef, useState } from 'react';
import { UserAuthContext } from '../Forms/UserAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowUpFromBracket, faImage, faTrash} from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase';


import ExhibitionItem from '../Components/ExhibitionItem';

function ArtistDashboard() {

  const [files, setFiles]=useState([])
  const [exhibition, setExhibition]  = useState(false)
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState(false)
  // const [exceededLimit, setexceededLimit] = useState(false)
  // const [excedeSize, setExedeSize] = useState(false)
  const [warning, setWarning] = useState(null)

const {user} = UserAuthContext()
 const nav = useNavigate()
 const location = useLocation()

//  useEffect(()=>{
//   files.length > 10? setexceededLimit(true):  setexceededLimit(false)
//   files.some(file=> (file.size / 1000000) >5 ? setExedeSize(true) : setExedeSize(false) )
//  }, [files ])
const exceededLimit = useMemo(()=> files.length > 10, [files])

const excedeSize = useMemo(()=> files.some(file=> (file.size / 1000000) >5), [files])
const reachedLimit = useMemo(()=> files.length ===  10, [files] )

 useEffect(()=>{
  if(( excedeSize || exceededLimit) || ( excedeSize && exceededLimit)){
    setWarning('Make sure you do not exceed upload limits for file size and amount.')
  } else {
    setWarning(null)
  }
 }, [excedeSize, exceededLimit])
 
const artists_dash = location.pathname === '/artist_dashboard'

console.log('excedesize', excedeSize)
console.log('exceededLimit', exceededLimit)



 useEffect(() => {
    async function getExhibition() {
      try{
      if (!user?.id) return;
      const q = query(collection(db, "exhibitions"), where("artists_id", "==", user.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setExhibition(doc.data());
         setUploadStatus(true)
      }
     
      }catch(err){
        console.error(err)
      } finally{
       
        setLoading(false)
      }
   
    }
    getExhibition();
  }, [user, uploadStatus]);


  // useRef hook is used to create a reference to a DOM element (</input>) in this case
  // fileInput now holds an object: {current: input}
const fileInput = useRef()


// trigger a click event of an input element
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

   function handleNext(){

    if(!exceededLimit && !excedeSize){
     nav('add_exhibition')
    }
   }


  return (
   <>
    {!loading ? <div className='flex  items-center flex-col h-full justify-between'>
      <section className='flex  w-[80vw] justify-between py-4 pt-16 border-b border-ternary-dark'>
       <div className=' '><h2 className='font-semibold text-primary-dark text-2xl'>Welcome, {user.firstName} {user.lastName}!</h2></div> 
      </section>
      {artists_dash && 
<section className='flex  w-[80vw] gap-16 py-10 justify-center'>
 
  {!exhibition && !uploadStatus? <div className='flex flex-col'>
   
    <h2 className='pb-4 font-semibold' >Next steps:</h2>
      <p className='text-xs py-2' >Upload your exhibition material for review:</p>
    <div className=' flex  gap-20  justify-between text-xs  py-2 px-4 '>

     <div className='border border-ternary-medium border-dashed flex p-6 flex-col rounded-md col-start-1 w-full justify-center items-center text-center py-6 bg-ternary-light'>
      <p>You can add up to 10 files.</p>
      <p className='text-center py-2 text-ternary-medium'>Max size: 5 MB per image</p>

   <FontAwesomeIcon className='text-2xl text-ternary-medium self-center text-center pb-8 pt-4' icon={faArrowUpFromBracket} />
  
{  exceededLimit &&
<div>
<p className='text-red-500 text-xs'>{`You can only upload 10 files. Remove  ${files.length - 10} files to proceede.`} </p>
</div>}

{ (!reachedLimit  && !exceededLimit) && <button data-testid="browse-button"  onClick={handleClick} className='text-center py-2 my-2 bg-secondary-dark text-secondary-light  px-4 rounded-full w-auto self-center' >Browse Files</button>} 

{reachedLimit && <p className='text-green-500 text-base font-semibold'>Upload limit has been reached!</p>}
     </div>
     {/* inputFile ref now points to a file input element which is hidden. A click on the input elment is triggered with handleClick() function
     which open browser's file picker UI.*/}
     <input
        data-testid="input-files" 
        type="file"
        ref={fileInput}
        style={{ display: 'none' }}
        // addFiles attached to onChange  callback updates files state
        onChange={addFiles}
        multiple
       
        accept=".jpg, .jpeg, .png" 
        />
     {files.length ? 
     <div>
       <div className='col-2  border-b col-start-2'>
      <h2 className='font-semibold pb-4'>Uploaded files:</h2>
        <div className=' overflow-y-scroll h-[45vh] flex-col justify-center px-4'>
              
        {files && files.map((file, index)=>(
      <div className=' justify-between flex gap-4 items-center  width-full p-2  '>
          <div data-testid='file-item' className={`grid grid-cols-[15%_5%_60%_10%_5%] w-full items-center text-[0.7rem] gap-4  px-4 py-2 ${(file.size / 1000000) > 5 ? 'bg-red-50':' bg-green-50'}`}>
          <p className={`${(file.size / 1000000) >5 ?'text-red-500': 'text-green-500' }  col-start-1   rounded-sm`}>{(file.size / 1000000) > 5 ? 'File is too big' : 'Accepted'}</p>
                <div className='grid w-full h-full aspect-square overflow-hidden  justify-center place-self-center rounded-sm border ' key={index}>
                <img
                className='object-cover w-full h-full border-ternary-medium'
                //  Web API URL static method createObjectURL which return a string containing unique blob URL
                src={URL.createObjectURL(file)}
                />
            </div>             
                <p className=' grid col-start-3'>{file.name} </p>
                <p className=' grid col-start-4'>({(file.size / 1000000).toFixed(2)} MB)</p>
         <button onClick={()=> deleteFile(index)} className='grid col-start-5 cursor-pointer' data-testid={`delete-button-${index}`}>
             <FontAwesomeIcon   className='text-red-600 'icon={faTrash}/>
         </button>
          </div>
        </div>
      ))}
        </div>
     </div>
     <div className='flex items-center justify-end gap-6 py-4'> 
     <p className='text-red-500'>{warning}</p>
{ !excedeSize && !exceededLimit && !warning && <button  data-testid="next"  onClick={()=> handleNext()} className=' flex  text-center py-2 mt-4 bg-primary-dark text-secondary-light px-4 rounded-full '>Next</button>
}     </div>


</div>
: null}
      </div>
  </div> : 
     <div className='grid'>
        <p className='text-xs pb-4'>Your exhibition preview:</p>
         <ExhibitionItem  title={exhibition.title} artistName={`${user.firstName} ${user.lastName}`} links={user.links} medium={exhibition.medium} descr={exhibition.descr}/>
    </div>}
  
    
</section>
}
<Outlet context={{files, user, uploadStatus, setUploadStatus}}/>
    </div> : 
    <div className='bg-ternary-light absolute w-full h-full'>
      <div className='flex justify-center items-center h-[100%]'>
      <div className="w-20 h-20 border-8 border-ternary-medium border-t-transparent rounded-full animate-spin"></div>

      </div>
      </div>}
    </>
  );
}





export default ArtistDashboard;
