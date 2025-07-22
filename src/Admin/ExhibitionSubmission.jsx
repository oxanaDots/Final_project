import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import ExhibitionItem from '../Components/ExhibitionItem';
import {  doc,collection, Timestamp, updateDoc, where, getDocs, query, orderBy  } from 'firebase/firestore';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faCheck} from '@fortawesome/free-solid-svg-icons';
function ExhibitionSubmission() {
  const linkParams = useMatch('/admin/exhibition_submission/:id');
  const currentId = linkParams.params
  const {exhibitions} = useOutletContext()
  const currentExhibition = exhibitions.find((item)=> item.docId === currentId['id'])
   const [statusB, setstatus] = useState(false)
  const navigate = useNavigate()


   async function reviewSubmission(status){
    try{
        const exhibitionDocRef = doc(db, 'exhibitions', currentExhibition.docId);

       const allPendingExhibitionsQuery = query(
      collection(db,'exhibitions'),
       where ('status', '==', 'pending'),
       orderBy('createdAt'))
         const allNonPendingExhibitionsQuery = query(
      collection(db,'exhibitions'),
       where ('status', '==', 'accepted'),
       orderBy('startsAt'))
       const allPendingExhibitionsSnapshot= await getDocs(allPendingExhibitionsQuery)
        const allAcceptedExhibitionsSnapshot= await getDocs(allNonPendingExhibitionsQuery)

      const pendingExhibitionsList = allPendingExhibitionsSnapshot.docs.map(doc =>({...doc.data(), docId:doc.id}))
      const acceptedExhibitionsList = allAcceptedExhibitionsSnapshot.docs.map(doc =>({...doc.data(), docId:doc.id}))

      console.log('STATUS', status)
      console.log('Current exhibition ref', exhibitionDocRef)
      console.log('all pending exhibitions', pendingExhibitionsList)
      console.log('all accepted exhibitions', acceptedExhibitionsList)
      console.log(exhibitions)
      // const startDate = Timestamp.fromDate(new Date('2025-07-14T12:30:00'))
     
      let startDate  
      if (allAcceptedExhibitionsSnapshot.size === 0){
        startDate = Timestamp.fromDate(new Date())
      } else {
        startDate = acceptedExhibitionsList[acceptedExhibitionsList.length-1].expireAt
      }

      const sevenDays = (24 * 7 * 60 * 60 * 1000)
      const expireAt = Timestamp.fromDate(new Date(startDate.toDate().getTime() + sevenDays)) 
     

        if (status === 'accepted'){
        await updateDoc(exhibitionDocRef, {
        status: status,
        // startsAt:  Timestamp.fromDate(new Date(expireAt.toDate().getTime() - (24 * 7 * 60 * 60 * 1000))) ,
        // expireAt: expireAt,  
         startsAt:  Timestamp.fromDate(new Date(startDate.toDate().getTime())),
        expireAt: expireAt,  
       })} else if (status === 'rejected'){
          await updateDoc(exhibitionDocRef, {
            status: status,

          })

       } 

   
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
    //  links={currentExhibition.links}
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