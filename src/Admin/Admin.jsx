import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
function AdminDashboard() {

  const [exhibitions, setExhibition] = useState([])
  const navigate = useNavigate()
  const exhibitionItem = useMatch('/admin/exhibition_submission/:id');

 async function fetchExhibition (){
      try{

        const snapshot = await getDocs(collection(db, 'exhibitions'))
        const data = snapshot.docs.map(doc=> ({   
          id: doc.id,
         ...doc.data()
        } ))
        
        setExhibition(data)
        
      } catch(err){
        console.error(err)
      }
    }


  useEffect(()=>{
   
    fetchExhibition()
  }, [])

  console.log(exhibitions)

 function navigateToExhibition(id) {
  navigate(`/admin/exhibition_submission/${id}`);
}
  
  return (
   <div className='flex  items-center flex-col h-full justify-between'>
      <section className='flex  w-[80vw] justify-between py-4 pt-16 border-b border-ternary-dark'>
       <div className=' '><h2 className='font-semibold text-primary-dark text-2xl'>Admin Dashboard</h2></div> 
      </section>
      {!exhibitionItem ? 
       <>
      <div className='flex flex-col py-4'>
      <h2 className='font-semibold py-4'> Exhibition submissions</h2>
      <div className=' flex flex-col cursor-pointer w-[30vw]'>
        {exhibitions && exhibitions.map((item, id)=>{
          return (
            <div key={id} onClick={()=> navigateToExhibition(item.id)} className='flex p-2 flex-col'>
          <div className='flex justify-between w-full  text-[0.6rem] text-opacity-60 '>
            <p>#{id + 1}</p>
            <p>{item.createdAt.toDate().toLocaleDateString()}</p>
           </div>
           <div className='flex justify-between text-xs font-semibold p-2 border border-primary-medium rounded-sm'>
            <p >{item.title}</p>

            <p className={`
              ${item.status === 'pending'&& 'text-amber-500'}
               ${item.status === 'accepted'&& 'text-green-600'}
               ${item.status === 'rejected'&& 'text-red-600'}

              `}>{item.status}</p>
            </div>
            </div>
          )
        })}
      </div>
      </div>
      </>
       :   <Outlet context={{exhibitions}}/>
      }
    

      </div>
  );
}

export default AdminDashboard;