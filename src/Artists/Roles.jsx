import { useNavigate } from 'react-router-dom';

function Roles() {
    const navigate =useNavigate()
    
  return (
    <section className='flex justify-center self-center min-h-screen'>
    <div className='flex flex-col items-center justify-center justify-items-center'>
      <h1 className='text-xl font-semibold pb-8'>Are you an artist or a business owner?</h1>
      <div className='flex gap-8'>
    
        <span onClick={()=> navigate('/artist_signup')} className='bg-ternary-light rounded-md cursor-pointer py-4 px-5'>Artist</span>
        <span onClick={()=> navigate('/business_signup')} className='bg-ternary-light rounded-md cursor-pointer py-4 px-5'>Bsuiness Owner</span>
      </div>
    </div>
    </section>
  );
}

export default Roles;