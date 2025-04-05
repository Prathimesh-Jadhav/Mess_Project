import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { MessContext } from '../GlobalContext/Context'
import axios from 'axios'

const Layout = () => {

  const { isLogin,setMealRate,setAdminDetails } = React.useContext(MessContext)

  if (!isLogin) {
    window.location.href = '/'
  }

  useEffect(()=>{
    getAdmin();
    getMessDetails();
  },[])

  const getAdmin = async () => {

    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getAdmin`);
    setAdminDetails(res.data.data);
  }

  const getMessDetails = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messDetails/getMessDetails`);
    setMealRate(Number(res.data.data[0].mealRate));
  }


  return (
    <div className='w-full'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout
