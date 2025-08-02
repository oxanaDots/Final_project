import React from 'react';
import NavMenu from './NavMenu';
import ExhibitionItem from './Components/ExhibitionItem';
import { NavLink } from 'react-router-dom';
import {  useEffect, useState } from 'react';
import {getDate} from './utilities/getDate.js'
import { fetchBusinesses}from './utilities/fetchBusinesses.js';
import { fetchCurrentExhibition } from './utilities/getchCurrentExhibition.js';
import { fetchUpcomingExhibitions } from './utilities/fetchUpcomingExhibitions.js';
import Spiner from './Components/Spiner.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import orderByDistance from 'geolib/es/orderByDistance';
import getDistance from 'geolib/es/getDistance';
import convertDistance from 'geolib/es/convertDistance'



// const address = '47 Addison road, BR2 9RS'
// const convert = await geoCode(address)
// console.log(convert)
 function Home() {
  const [businesses,  setBusinesses] = useState([]);
  const [sortedBusinesses, setSortedBusinesses] = useState([])
  const [exhibitions, setExhibitions] = useState([])
  const [currentExhibition, setCurrentExhibition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)
  const [userLocation, setUserLocation] = useState({})


const docs = [...businesses.values()]

// get user's current location in latlong and show busiensses closest to user's location
useEffect(()=>{
 navigator.geolocation.getCurrentPosition(res=>{
       setUserLocation({latitude:res.coords.latitude, longitude: res.coords.longitude })})
      }, [])
   
  useEffect(()=>{

     function helper(){
       if (userLocation && businesses){
            const mappedGeos = docs.map((item) => item.geoLocation)
            const orderedLocations = orderByDistance(userLocation, mappedGeos)
            const arr = []
           for (const obj of orderedLocations){
            const value = businesses.get(obj)
            const distanceInMeters = getDistance(userLocation, obj, 0.2)
            const convertedIntoMiles = convertDistance(distanceInMeters, 'mi')
            arr.push({...value, distance: convertedIntoMiles.toFixed(2)})
            }
          
             setSortedBusinesses (arr)
             } else{
          setBusinesses(docs)
        }
    }
     helper()
    }, [userLocation, businesses])
  
    console.log(businesses)


  function handleExhibitiob(direction){
      if (direction === 'next'){
        setIndex((prev)=> prev <= exhibitions.length -2? prev+1: prev )
      } else if (direction === 'prev'){
       setIndex((prev)=> prev > 0? prev-1: prev)
      } else{
        setIndex(0)
      }
  }
 



 const expireDate = currentExhibition? currentExhibition.expireAt: null

 useEffect(()=>{
  let isMounted = true
  async function helper(){
      const businessesData = await fetchBusinesses()
         setBusinesses( businessesData)
  }
      helper()
      return()=>{
        isMounted = false
      }
 }, [])




  useEffect(() => {
  let isMounted = true
   setLoading(true)
  
    async function helper(){
      
      try{
    
         const currentExhibition = await fetchCurrentExhibition()
          setCurrentExhibition(currentExhibition[0])
          setExhibitions([currentExhibition[0]])

       
      }catch(err){
        console.error(err)
      } finally{
        setLoading(false)
      }
    }
    helper()
     return()=>{
        isMounted = false
      }
  }, []);


 


  useEffect(()=>{
  let isMounted = true

    async function helper(){

      try{
  

        if (currentExhibition && exhibitions.length> 0){
          
          const upcomingExhibitions = await fetchUpcomingExhibitions(expireDate)
          setExhibitions((prev)=>  [...prev, ...upcomingExhibitions])
        }
      


    
      } catch(err){
        console.error(err)
      }
    }

    helper()
     return()=>{
        isMounted = false
      }
  }, [currentExhibition])




 return (
   <div className='m-0'>
    {loading ? <Spiner/>:
    <div className='flex  m-0 flex-col justify-center items-center bg-primary-medium'>
    <NavMenu/>

<h1 className='text-3xl  font-semibold'>Main Heading</h1>
   <section className='grid grid-cols-[20%_30%_20%] pt-6 pb-20 justify-center items-baseline  gap-20'>


    <div className='grid-cols-1'>
<h3 className='text-xl py-3'>Subheading</h3>
<p className='text-xs py-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
   <div>   <NavLink to='/specify_role'><button className='submit-btn'>Create an Account</button></NavLink>
   </div>
   </div>

  <div className='grid-cols-2'> 
   
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
    <div className=' flex gap-6 flex-col overflow-y-scroll h-[25rem]'>
    {sortedBusinesses.map(item=> (
      <div className='text-[0.6rem] flex  flex-col text-ternary-medium'>
        <div className='flex justify-between px-2 '>
        <p className=' self-end'>{item.business_type}</p>
        <p>Distance</p>
        </div>
      <div className='text-xs flex justify-between  text-primary-dark
      border border-y border-x-0 items-center border-ternary-medium px-2 py-2 '>

     <h2 className='text-xs font-semibold'>{item.businessName}</h2>
    <h2 className='text-xs border rounded-md border-ternary-dark py-1 px-2'>{item.distance} miles</h2>
    </div>
        </div>
 ) )}
  </div> 
     </div> 
   </section>
   </div>
  }
  </div>
  );
}

export default Home;

