import React from 'react';

function ExhibitionItem({
  links =['www.website.com', '@insta_name'], 
  artistName='Artist Name', 
  title='Untitled', 
  medium='unknown',
   descr='',
  date=''}) {
  return (
   
      <div className='flex flex-col  text-[0.7rem]' >
       
        <section className='grid w-full justify-between grid-cols-[70%_30%] border-ternary-medium  bg-white shadow-md gap-2  p-8 text-left  items-baseline'>
         <div className=' w-full row-1 items-baseline'>
                <p className='font-[700]'>{artistName}</p>
               <span className=' flex gap-1'>
               <p className='font-semibold italic'>{title} </p>
               </span>
                <p className=''>{medium}</p>
            </div>
            <div className='col-2 row-1  text-right'>
              <p className=''>{date}</p> 

            </div>
            <p className=' col-1 col-span-2 '>{descr}</p>
            <div className='flex flex-col col-1 row-3 self-end'>
            {links.map(link => <p className=' '>{link}</p>)}

            </div>

        </section>
      </div>
   
  );
}

export default ExhibitionItem;