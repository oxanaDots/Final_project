import Home from './Home'
import { createBrowserRouter, NavLink, RouterProvider } from 'react-router-dom'

import './index.css' 
import SignUpArtist from './Artists/SignUpArtist'
import Roles from './Forms/Roles'
import BusinessSignup from './Business/BusinessSignUp'
import ArtistDashboard from './Artists/ArtistDahsBoard'
import SignIn from './Forms/SignIn'
import ProtectedRoute from './Forms/ProtectedRoute'
import { AuthProvider } from './Forms/UserAuthContext'
import UploadExhibition from './Artists/UploadExhibition'
import AdminDashboard from './Admin/Admin'
import ExhibitionSubmission from './Admin/ExhibitionSubmission'
function App() {


  const router = createBrowserRouter([
   
    { path: '/home',
      element: <Home/>
    },
    { path: '/',
      element: <Home/>
    },
   
    {
      path: '/artist_signup',
      element: <SignUpArtist/>
    },

    {
      path: '/specify_role',
      element: <Roles/>
    },
    {
      path: '/business_signup',
      element: <BusinessSignup/>
    },
    {
      path: '/artist_dashboard',
      element: (<ProtectedRoute>
        <ArtistDashboard/>
        </ProtectedRoute>),
          children: [
      {
        path: 'add_exhibition',
        element: <UploadExhibition />
      }
    ]
    },
  

    {
      path: '/signin',
      element: <SignIn/>
    },
   
    {
      path: '/admin',
      element: <AdminDashboard/>,
      children: [
        {
          path: 'exhibition_submission/:id',
          element: 
            <ExhibitionSubmission/>
          
        }
      ]
    }
  ])

  return (
    <div>
     
 
    <AuthProvider>

<RouterProvider router={router}/>

</AuthProvider>

     
   
    </div>
  )
}

export default App
