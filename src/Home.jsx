import React from 'react';
import NavMenu from './NavMenu';
import ExhibitionItem from './Components/ExhibitionItem';
import { NavLink } from 'react-router-dom';
import { getDocs, collection, query, Timestamp, where } from "firebase/firestore";
import {  db } from "./firebase.js"; 
import {  useEffect, useState } from 'react';
import {getDate} from './utilities/getDate.js'
import { fetchBusinesses, fetchUpcomingExhibitions} from './utilities/fetchBusinesses.js';
import Spiner from './Components/Spiner.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';


 function Home() {
  const [ businesses,  setBusinesses] = useState([]);
  const [exhibitions, setExhibitions] = useState([])
  const [currentExhibition, setCurrentExhibition] = useState({})
  const [loading, setLoading] = useState(false)
 

const currentDay = Timestamp.fromDate(new Date());

const expireFormatted = getDate(currentExhibition)

 const expireDate = currentExhibition.expireAt

  useEffect(() => {
   setLoading(true)
  
    async function helper(){
      
      try{
         const businessesData = await fetchBusinesses()
         setBusinesses( businessesData)
         
        const querry = query(
          collection(db, 'exhibitions'),
          where('startsAt', '<=', currentDay),
          where ('status', '==', 'accepted'),
          where('expireAt', '>', currentDay))
          
          const currentExhibitionSnapShot = await getDocs(querry)
          const currentExhibition = currentExhibitionSnapShot.docs.map(doc => ({...doc.data(), docId: doc.id}))
          setCurrentExhibition(currentExhibition&& currentExhibition[0])
     
       
      }catch(err){
        console.error(err)
      } finally{
        setLoading(false)
      }
    }


    helper()
  }, []);


  


  useEffect(()=>{

    async function helper(){

      try{
  
      if( expireDate  ){
        const upcomingExhibitions = await fetchUpcomingExhibitions(expireDate)
        setExhibitions(upcomingExhibitions)
      } else{
        console.log(false)
        throw new Error('Error is......')
      }
         
      } catch(err){
        console.error(err)
      }
    }

    helper()
  }, [currentExhibition])


console.log(exhibitions)

 return (
   <>
    {loading ? <Spiner/>:
    <div className='flex  m-0 flex-col justify-center items-center bg-primary-medium'>
    <NavMenu/>

<h1 className='text-3xl  font-semibold'>Main Heading</h1>
   <section className='grid grid-cols-[20%_30%_20%] pt-10 justify-center items-baseline  gap-20'>


    <div className='grid-cols-1'>
<h3 className='text-xl py-3'>Subheading</h3>
<p className='text-xs py-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
   <div>   <NavLink to='/specify_role'><button className='submit-btn'>Create an Account</button></NavLink>
   </div>
   </div>

  <div className='grid-cols-2'> 
    <div className='flex text-xs items-center m-0 p-2 bg-white justify-between text-ternary-medium'>
     <FontAwesomeIcon icon={faArrowLeft}/>
     <p>current</p>
     <FontAwesomeIcon icon={faArrowRight}/>
    </div>
    <ExhibitionItem 
  
  artistName={currentExhibition.artistFirstName + currentExhibition.artistLastName}
  title={currentExhibition.title}
  medium={currentExhibition.medium}
   descr={currentExhibition.descr}
   links={currentExhibition.links}
   date={expireFormatted}
   
    />
  </div>

<div className='text-xs'>
    <h2 className='text-sm font-semibold pb-4'>Art Hosts in your area:</h2>
    <div className='overflow-y-scroll h-[25rem]'>
    {businesses.map(item=> (
      <div className='text-xs flex justify-between bg-white px-2 py-2 my-2'>
     <h2 className='text-xs'>{item.businessName}</h2>
    <h2 className='text-xs'> 0.5 miles</h2>
    </div>
 ) )}
  </div>
   

 
     </div>


   </section>

<div className='bg-primary-medium  pt-10  px-[10vw] flex-col flex justify-center'>
<div className=' flex justify-between  gap-10   '>
  <div className='flex flex-col justify-between w-[50vw]'>

  
   </div>
 


   <section className='grid grid-cols-[70%_30%] gap-4 border border-1 border-ternary-medium  w-full justify-between rounded-md py-6 px-4'>
  

 
   <div className='col-2 grid  w-full pr-4'>
   
    </div>

   </section>
   

   </div>
 
   <section className="pt-20 pb-10 w-full ">
   <h3 className='p-5 font-semibold text-left'>Explore upcoming exhibitions:</h3>
<div className=' grid grid-cols-3 scroll border-y border-ternary-medium gap-8 p-8' >
      <ExhibitionItem status='upcoming'/>
      <ExhibitionItem status='upcoming'/>
      <ExhibitionItem status='upcoming'/>
      <ExhibitionItem status='upcoming'/>
      <ExhibitionItem status='upcoming'/>
</div>

</section>
   </div>
  </div>
  }
  </>
  );
}

export default Home;

