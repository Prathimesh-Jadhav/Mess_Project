import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {

  return (
    <div >
            <Context>
          <Router>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/layout' element={<Layout />}>
                <Route path='user/dashboard' element={<UserDashboard />} />
                <Route path='admin/dashboard' element={<Dashboard />} />
                <Route path='admin/members' element={<Members />} />
                <Route path='admin/messDetails' element={<MessDetails />} />
                <Route path='user/mealDetails' element={<MealDetails />} />
                <Route path='admin/memberDetails/:id' element={<MemberDetails />} />
              </Route>
            </Routes>
          </Router>
        </Context>
    </div>
  )
}

export default App
