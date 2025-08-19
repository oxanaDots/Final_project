import React from 'react';
import NavMenu from './NavMenu';
import ExhibitionItem from './Components/ExhibitionItem';
import { NavLink, useLocation } from 'react-router-dom';
import {  useEffect, useState } from 'react';
import {getDate} from './utilities/getDate.js'
import { fetchBusinesses}from './utilities/fetchBusinesses.js';
import { fetchCurrentExhibition } from './utilities/getchCurrentExhibition.js';
import { fetchUpcomingExhibitions } from './utilities/fetchUpcomingExhibitions.js';
import Spiner from './Components/Spiner.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { orderByDistance, getDistance, convertDistance } from 'geolib'




 function Home() {
  const [businesses,  setBusinesses] = useState(new Map());
  const [sortedBusinesses, setSortedBusinesses] = useState([])
  const [exhibitions, setExhibitions] = useState([])
  const [currentExhibition, setCurrentExhibition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)
  const [userLocation, setUserLocation] = useState({})

const docs = [...businesses.values()]

console.log('use', userLocation)
// get user's current location in latlong and show busiensses closest to user's location
      useEffect(()=>{
       navigator.geolocation.getCurrentPosition(res=>{
       setUserLocation({latitude:res.coords.latitude, longitude: res.coords.longitude })})
      }, [])


       useEffect(()=>{
  async function helper(){
      const businessesData = await fetchBusinesses()
         setBusinesses( businessesData)
  }
      helper()
   
 }, [])
   
  useEffect(()=>{
    let active = true

     function helper(){
       if (userLocation && businesses && active){
            const mappedGeos = docs.map((item) => item.geoLocation)
            const orderedLocations = orderByDistance(userLocation, mappedGeos)
            const arr = []
           for (const obj of orderedLocations){
            const businessDoc = businesses.get(obj)
            // calc distance between current user and each enterprise
            const distanceInMeters = getDistance(userLocation, obj, 0.2)
            const convertedIntoMiles = convertDistance(distanceInMeters, 'mi')
            arr.push({...businessDoc, distance: convertedIntoMiles.toFixed(2)})
            }
          
             setSortedBusinesses (arr)
             } else{
             setBusinesses(docs)
        }
    }
     helper()

    return () => {
    active = false;
  };
    }, [userLocation, businesses])
  
    


  function handleExhibitiob(direction){
      if (direction === 'next'){
        setIndex((prev)=> prev <= exhibitions.length -2? prev+1: prev )
      } else if (direction === 'prev'){
       setIndex((prev)=> prev > 0? prev-1: prev)
      } else{
        setIndex(0)
      }
  }
 



 const expireDate = currentExhibition ? currentExhibition.expireAt: null


  useEffect(() => {
 let active = true
   setLoading(true)
  
    async function helper(){
      
      try{
    
         const currentExhibition = await fetchCurrentExhibition()
         if (active){
           setCurrentExhibition(currentExhibition[0])
           setExhibitions([currentExhibition[0]])

         }

       
      }catch(err){
        console.error(err)
      } finally{
        setLoading(false)
      }
    }
    helper()
     return () => {
    active = false;
  };
   
  }, []);


 


  useEffect(()=>{
let active = true

    async function helper(){

      try{
  

        if (currentExhibition && exhibitions.length > 0){
          
          const upcomingExhibitions = await fetchUpcomingExhibitions(expireDate)
          if (active){
            setExhibitions((prev)=>  [...prev, ...upcomingExhibitions])

          }
        }
     } catch(err){
        console.error(err)
      }
    }

    helper()
     return () => {
    active = false;
  };
 
  }, [currentExhibition, expireDate])




 return (
   <div className='m-0 h-full'>
    {loading ? <Spiner/>:
    <div className='flex h-full m-0 flex-col justify-center  bg-primary-medium'>
    <NavMenu/>

{/* <h1 className='text-3xl  font-semibold'>Main Heading</h1> */}
   <section className='grid grid-cols-2 w-[70%] h-full pt-28 pb-20 self-center justify-center items-baseline  gap-20'>




  <div className='grid-cols-2 self-center'> 
   
    <div className='flex text-xs items-center align-middle  p-2 bg-white justify-between text-ternary-medium'>
      <div  
      data-testid="prev"
            onClick={()=> handleExhibitiob('prev')}
            className='cursor-pointer'>
          <FontAwesomeIcon icon={faArrowLeft} />
      </div>


      <div className='cursor-pointer'
       data-testid="current"
      onClick={()=> handleExhibitiob('current')}
      >
      <p className={`${index === 0 && 'underline-offset-2 underline text-ternary-dark'}  m-0`} >current</p>
      </div>


      <div  className='cursor-pointer'
      data-testid="next"
        onClick={()=> handleExhibitiob('next')}
      >
     <FontAwesomeIcon icon={faArrowRight} />
      </div>
    </div>
          {exhibitions.length > 0 && <ExhibitionItem 
          artistName={`${exhibitions[index]?.artistFirstName} ${exhibitions[index]?.artistLastName}`}
          title={exhibitions[index]?.title}
          medium={exhibitions[index]?.medium}
            descr={exhibitions[index]?.descr}
            links={exhibitions[index]?.links}
            date={index === 0 ? getDate(exhibitions[index]?.expireAt): getDate(exhibitions[index]?.startsAt)}
            dateMessage={index ===0? 'Ends on': 'Starts on '}
    />}
  </div>

<div className='text-xs'>
    <h2 className='text-sm font-semibold text-zinc-600 pb-6'>Currently exhibited at:</h2>
    {businesses.size > 0 ?<div className=' flex gap-6 flex-col overflow-y-scroll h-[25rem]'>
    {sortedBusinesses.map(item=> (
      <div className='text-[0.6rem] flex  flex-col text-ternary-medium'>
        <div className='flex justify-between px-2 '>
        <p className=' self-end'>{item.business_type}</p>
        <p>Distance</p>
        </div>
      <div className='text-xs flex justify-between  text-primary-dark
      border border-y border-x-0 items-center border-ternary-medium px-2 py-2 '>

     <h2 className='text-xs font-semibold'>{item.businessName}</h2>
    <div className='flex justify-end flex-col gap-2'>
    {userLocation.latitude && userLocation.longitude ?<h2 className='text-xs border self-end flex flex-col rounded-md border-ternary-dark py-1 px-2'>{item.distance} miles</h2>
    : null}
    <h2>{item.location}, {item.postcode}</h2>
   
     </div>
    </div>
        </div>
 ) )}
  </div> :
  <p>
    No enterprises are currently displaying
    </p>}
     </div> 
   </section>
   </div>
  }
  </div>
  );
}

export default Home;

