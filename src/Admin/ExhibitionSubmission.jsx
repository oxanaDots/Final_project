import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import ExhibitionItem from '../Components/ExhibitionItem';
// import { getDoc, doc,  } from 'firebase/firestore';
// import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faCheck} from '@fortawesome/free-solid-svg-icons';
function ExhibitionSubmission() {
  const linkParams = useMatch('/admin/exhibition_submission/:id');
  const currentId = linkParams.params
  const {exhibitions} = useOutletContext()
  const currentExhibition = exhibitions.find((item)=> item.id === currentId['id'])
   const [statusB, setstatus] = useState(false)
  const navigate = useNavigate()
//   async function fetchArtistDetails(){
//     try{

//         const docRef= doc(db, 'artists', currentExhibition.artists_id)
//         const snapShot = await getDoc(docRef)
//         const data = {id: snapShot.id, ...snapShot.data()}
//         if (!snapShot.empty){
//             setArtistInfo(data)
//         }
//     }catch(err){
//         console.error(err)
//     }
//   }
//   useEffect(()=>{
//     fetchArtistDetails()
//   }, [currentExhibition])
  
   async function reviewSubmission(){
    try{
    //     let flag = 0
    //     const exhibitionDocRef = doc(db, 'exhibitions', currentExhibition.id);
    //     const exhibitionSize = collection(db, 'exhibitions');
    //    const size = await getCountFromServer(exhibitionSize);
    //    const count = size.data().count
//        if (status === 'accepted'){
//         await updateDoc(exhibitionDocRef, {
//         status: status,
//         expireAt: Timestamp.fromDate(new Date(Date.now() + (24 * 7 * 60 * 60 * 1000)))
       
// })
//        }
   
      setstatus(true)
    } catch(err){
        console.error(err)
    }
     

   }
 
  return (
    <div className='grid justify-center py-8'>
    {!statusB ? 
    <>
    <div className='grid justify-center grid-cols-[30%_40%]'>
       
      <ExhibitionItem 
     status = 'current'
     links={currentExhibition.links}
     artistName={`${currentExhibition.artistFirstName} ${currentExhibition.artistLastName}`}
     title={currentExhibition.title}
     medium={currentExhibition.medium}
     descr={currentExhibition.descr}/>
    <section className='grid grid-cols-2 justify-center   col-1 gap-4 px-6 '>
    {currentExhibition.images.map((link, index)=> (
            <div className='  aspect-square overflow-hidden  justify-center place-self-center rounded-sm border ' key={index}>
                <img
                className='object-cover w-full h-full border-ternary-medium'
                src={link}
                />
            </div>
        ))}
    </section>
    </div >
    <div className='flex  justify-center items-center py-10 text-3xl'>
        
    <button onClick={()=>reviewSubmission('accepted')} className=' text-green-600 flex'>
        <FontAwesomeIcon icon={faCheck}/>
    </button>
    <button onClick={()=> reviewSubmission('rejected')} className='flex text-red-600 p-12'>
        <FontAwesomeIcon icon={faXmark}/>
    </button>
    </div>
    </>
     : <div className='bg-ternary-light px-8 py-6'>
        <h2 className='py-6 text-ternary-dark font-semibold text-lg'>Submission updated!</h2>
        <button onClick={()=> navigate('/admin')} className='submit-btn'>Return to my dashboard</button>
     </div>
   
    }
    </div>
  );
}

export default ExhibitionSubmission;