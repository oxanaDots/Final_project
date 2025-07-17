import React from 'react';

function ExhibitionItem({
  links =['www.website.com', '@insta_name'], 
  artistName='Artist Name', 
  title='Untitled', 
  medium='unknown',
   descr='',
  date='',
dateMessage=''}) {
  return (
   
      <div className='flex flex-col  text-[0.7rem]' >
       
        <section className='grid w-full justify-between grid-cols-[60%_40%] h-[60vh] border-ternary-medium  bg-white shadow-md gap-2 px-10 py-8 text-left  items-baseline'>
         <div className=' w-full row-1 mb-10 items-baseline'>
                <p className='font-[700]  mb-0'>{artistName}</p>
               <span className=' flex '>
               <p className='font-semibold  mb-0 italic'>{title} </p>
               </span>
                <p className=''>{medium}</p>
            </div>
              <p cl className='place-items-end text-right'>{dateMessage} {date}</p> 

            <p className='  col-span-2 my-10'>{descr}</p>
            <div className='flex flex-col col-1 row-3 items-baseline' >
            {links.map(link => <p className=' place-items-baseline'>{link}</p>)}

            </div>

        </section>
      </div>
   
  );
}

export default ExhibitionItem;