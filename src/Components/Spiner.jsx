import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';


function Spiner() {
  return (
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <Spinner animation="border" role="status"   style={{ width: '6rem', height: '6rem', borderWidth:'0.5rem' }}
 className='text-primary-dark '>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
  );
}

export default Spiner;