import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { MessContext } from '../GlobalContext/Context'

const Layout = () => {

  const {isLogin} = React.useContext(MessContext)
  const {setRole} = React.useContext(MessContext)

  useEffect(() => {
    setRole(localStorage.getItem('role'))
  }, [])

if(!isLogin){
  window.location.href = '/'
}

  return (
    <div className='w-full'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout
