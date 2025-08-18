import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import ExhibitionItem from '../Components/ExhibitionItem';
import {  doc,collection, Timestamp, updateDoc, where, getDocs, query, orderBy  } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark, faCheck} from '@fortawesome/free-solid-svg-icons';
import { ref } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';

function ExhibitionSubmission() {
  const linkParams = useMatch('/admin/exhibition_submission/:id');
  const currentId = linkParams.params
  const {exhibitions} = useOutletContext()
  const currentExhibition = exhibitions.find((item)=> item.docId === currentId['id'])
   const [statusB, setstatus] = useState(false)
   const [paths, setPaths] = useState([])
  const navigate = useNavigate()

console.log('imgaes',currentExhibition.images)

  useEffect(()=>{
    async function helper(){
      try{
        
      const urls = await Promise.all(
  currentExhibition.images.map((path) => getDownloadURL(ref(storage, path)))
);
       setPaths(urls);
  
      } catch(err){
        console.error(err)
      }
    }
    helper()
  }, [])

  console.log('paths', paths)

console.log(currentExhibition)
   async function reviewSubmission(status){
    try{
        const exhibitionDocRef = doc(db, 'exhibitions', currentExhibition.docId);
         console.log(exhibitionDocRef)
        const allNonPendingExhibitionsQuery = query(
      collection(db,'exhibitions'),
       where ('status', '==', 'accepted'),
       orderBy('startsAt'))

      const allAcceptedExhibitionsSnapshot = await getDocs(allNonPendingExhibitionsQuery)
      const acceptedExhibitionsList = allAcceptedExhibitionsSnapshot.docs.map(doc =>({...doc.data(), docId:doc.id}))
     
      let startDate  
      if (allAcceptedExhibitionsSnapshot.size === 0){
        // convert todays date into firebase Timestamp using fromDate()
        startDate = Timestamp.fromDate(new Date())
      } else {
        startDate = acceptedExhibitionsList[acceptedExhibitionsList.length-1].expireAt
      }

      const sevenDays = (24 * 7 * 60 * 60 * 1000)


      // convert startDate into a Js object so we can add 7 days, then back into a Timestamp
      const expireAt = Timestamp.fromDate(new Date(startDate.toDate().getTime() + sevenDays)) 
     

        if (status === 'accepted'){
        await updateDoc(exhibitionDocRef, {
        status: status,
         startsAt:  Timestamp.fromDate(new Date(startDate.toDate().getTime())),
        expireAt: expireAt,  
       })} else if (status === 'rejected'){
          await updateDoc(exhibitionDocRef, {
            status: status,

          })} 

      setstatus(true)
    } catch(err){
        console.error(err)
    }
     

   }
 


   useEffect(()=>{

   })
  return (
    <div className='flex flex-col justify-center py-8'>
   {!statusB ? 
    <div className='flex  flex-col justify-center items-center'>
    <div className='grid justify-center grid-cols-[30%_50%]'>
      <ExhibitionItem 
     status = 'current'
    //  links={currentExhibition.links}
     artistName={`${currentExhibition.artistFirstName} ${currentExhibition.artistLastName}`}
     title={currentExhibition.title}
     medium={currentExhibition.medium}
     descr={currentExhibition.descr}/>
    <section className='grid justify-center  gap-4 grid-cols-3 grid-rows-3 px-6 '>
    {currentExhibition.images && currentExhibition.images.map((link, index)=> (
            <div className='  justify-center col-1 rounded-sm border ' key={index}>
                <img
                className='object-cover w-full h-full border-ternary-medium'
                src={paths[index]}
                /> 
            </div>
        ))}
    </section>
    </div >
    <div  data-testid="submission-outcome" className='flex  justify-center items-center py-10 text-3xl'>
        
    <button data-testid="accept" onClick={()=>reviewSubmission('accepted')} className=' text-green-600 flex'>
        <FontAwesomeIcon icon={faCheck}/>
    </button>
    <button data-testid="reject" onClick={()=> reviewSubmission('rejected')} className='flex text-red-600 p-12'>
        <FontAwesomeIcon icon={faXmark}/>
    </button>
    </div>
    </div>
     : <div className='bg-ternary-light px-8 py-6'>
        <h2 className='py-6 text-ternary-dark font-semibold text-lg'>Submission updated!</h2>
        <button data-testid="return-to-admin" onClick={()=> navigate('/admin')} className='submit-btn'>Return to my dashboard</button>
     </div>
   
    }
    </div>
  );
}

export default ExhibitionSubmission;