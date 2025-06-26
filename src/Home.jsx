import React from 'react';
import NavMenu from './NavMenu';
import ExhibitionItem from './Components/ExhibitionItem';
import { NavLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { getDocs, collection } from "firebase/firestore";
import {  db } from "./firebase.js"; 

import 'leaflet/dist/leaflet.css';
import {  useEffect, useState } from 'react';

function LocationMarker({ setPosition }) {
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
}

 function Home() {
  const [ businesses,  setBusinesses] = useState([]);

//    const [position, setPosition] = useState(null)
   

//  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "businesses"));
        const data = snapshot.docs.map(doc => ({
          businessId: doc.id,
          ...doc.data(),
        }));

        setBusinesses(data);
        console.log(data)

        // const coords = await Promise.all(
        //   data.map(async (biz) => {
        //     const address = `${biz.location}, ${biz.postcode}`;
        //     const res = await fetch(
        //       `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
        //     );
        //     const geo = await res.json();
        //     if (geo[0]) {
        //       return {
        //         name: biz.businessName,
        //         lat: parseFloat(geo[0].lat),
        //         lon: parseFloat(geo[0].lon),
        //       };
        //     }
        //     return null;
        //   })
        // );

        // setLocations(coords.filter(Boolean));
      } catch (error) {
        console.error( error);
      }
    };

    fetchBusinesses();
  }, []);




  return (
    <div className='flex w-full flex-col justify-center items-center'>

    <NavMenu/>

   <section className='flex flex-col  w-[50vw] h-[100vh]  pt-20 items-center'>
<h1 className='text-5xl py-3 font-semibold'>Main Heading</h1>
<h3 className='text-2xl py-3'>Subheading</h3>
<p className='text-sm py-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

</p>
   <div>   <NavLink to='/specify_role'><button className='submit-btn'>Create an Account</button></NavLink>
   </div>
   </section>

<div className='bg-primary-medium w-[80vw] pt-10 w-full px-[10vw] flex-col flex justify-center'>
<div className=' flex justify-between  gap-10   '>
  <div className='flex flex-col justify-between w-[50vw]'>
  <div>
    <h2  className='p-5 font-semibold text-left'>Current exhibition:</h2>
    <ExhibitionItem/>
  </div>
  
   </div>
 


   <section className='grid grid-cols-[70%_30%] gap-4 border border-1 border-ternary-medium  w-full justify-between rounded-md py-6 px-4'>
  

 
{/* <MapContainer className='rounded-md' style={{ height: '100%', width: '100%' }}
     center={ [51.505, -0.09]} zoom={15} scrollWheelZoom={true}>
  <TileLayer
    detectRetina={true}
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

<LocationMarker setPosition={setPosition} />
  {position && (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )}
 {locations.map((biz, idx) => (
        <Marker key={idx} position={[biz.lat, biz.lon]}>
          <Popup>{biz.businessName}</Popup>
        </Marker>
      ))}
</MapContainer> */}
   <div className='col-2 grid  w-full pr-4'>
   <div >
    <h2 className='text-sm font-semibold pb-4'>Art Hosts in your area:</h2>
    <div className='overflow-y-scroll h-[25rem]'>
    {businesses.map(item=> (
      <div className='text-xs flex justify-between bg-white px-2 py-2 my-2'>
     <h2>{item.businessName}</h2>
    <h2> 0.5 miles</h2>
    </div>
 ) )}
 <button></button>
  </div>
   

 
     </div>
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
  );
}

export default Home;

