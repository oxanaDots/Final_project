import React from 'react';

// import { UserAuthContext } from '../Forms/UserAuthContext';

// import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks'

function ArtistDashboard() {
  // const {user}= UserAuthContext()



  return (
    <div className='flex  items-center flex-col h-full justify-between'>
      <section className='flex  w-[80vw] justify-between py-4  border-b border-ternary-dark'>
       <div className=' '><h2 className='font-semibold text-primary-dark text-2xl'>Welcome, {}!</h2></div> 
      </section>


    </div>
  );
}

export default ArtistDashboard;