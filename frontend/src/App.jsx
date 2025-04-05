import { BrowserRouter as Router, Routes, Route, useLoaderData } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'
import UserDashboard from './pages/user/Dashboard'
import Login from './pages/Login'
import Layout from './pages/Layout'
import Context from './GlobalContext/Context'
import "@radix-ui/themes/styles.css";
import Members from './pages/admin/Members'
import MessDetails from './pages/admin/MessDetails'
import MealDetails from './pages/user/MealDetails'
import LandingPage from './pages/LandingPage'
import MemberDetails from './pages/admin/MemberDetails'
import { useEffect, useState } from 'react'
import logovideo from './assets/logovideo.mp4'
import { MdKeyboardVoice } from 'react-icons/md'
import ProfilePage from './pages/ProfilePage'
import { ToastContainer } from 'react-toastify'
import Meals from './pages/admin/Meals'
import Payments from './pages/user/Payments'
import ResetPassword from './pages/ResetPassword'

function App() {


  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <div >
      {loading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-60 flex-col gap-2 z-50">
          <div className='flex flex-col items-center justify-center gap-8'>
          <div class="loader"></div>
          <div>Loading...</div>
          </div>
        </div>
      )}
      <ToastContainer />
      <Context>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='/layout' element={<Layout />}>
              <Route path='user/dashboard' element={<UserDashboard />} />
              <Route path='admin/dashboard' element={<Dashboard />} />
              <Route path='admin/members' element={<Members />} />
              <Route path='admin/meals' element={<Meals />} />
              <Route path='admin/messDetails' element={<MessDetails />} />
              <Route path='user/mealDetails' element={<MealDetails />} />
              <Route path='user/payments' element={<Payments />} />
              <Route path='admin/memberDetails/:id' element={<MemberDetails />} />
              <Route path='profilepage/:id' element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </Context>
    </div>
  )
}

export default App
