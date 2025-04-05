import React from 'react'
import { navOptions } from '../data'
import { Link, useNavigate } from 'react-router-dom'
import { MessContext } from '../GlobalContext/Context'
import avatar from '../assets/avatar (2).png'
import { FcMenu } from "react-icons/fc";
import Menubar from './Menubar'
import { IoMdLogOut } from "react-icons/io";
import buddy from '../assets/buddy\'sKitchen.png'

const Navbar = () => {
  const { role, setIsLogin } = React.useContext(MessContext)
  const [openMenubar, setOpenMenubar] = React.useState(false)
  const Navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLogin(false);
    Navigate('/');
  }

  return (
    <div className='bg-white w-full h-16 flex justify-between px-[30px] border-b-[1px] items-center font-poppins fixed top-0 left-0 right-0 z-20'>
      <img src={buddy} alt="" width={55} />
      <div className='max-md:hidden'>
        <ul className='flex gap-4'>
          {
            navOptions[role]?.map((item) => <Link key={item.name} className='text-text hover:text-primaryhover flex gap-1 items-center' to={item.path}>
              <div>{item.logo && <item.logo />}</div>
              <li>{item.name}</li>
            </Link>)
          }
        </ul>
      </div>

      <div className='flex gap-4 items-center'>
        <div className='h-[40px] w-[40px] rounded-full border-[1px] max-md:hidden relative hover:cursor-pointer' onClick={() => { Navigate(`/layout/profilepage/${sessionStorage.getItem('mobileNumber')}`) }}>
          <img src={avatar} alt="" />
        </div>
        <div className='h-[40px] w-[40px] rounded-full border-[1px] max-md:hidden relative flex items-center justify-center bg-background hover:cursor-pointer' onClick={handleLogout}>
          <IoMdLogOut size={25} />
        </div>
      </div>
      <div className='md:hidden' onClick={() => { setOpenMenubar(!openMenubar) }}>
        <FcMenu size={25} />
      </div>

      {/* Menubar */}
      <Menubar setOpenMenubar={setOpenMenubar} openMenubar={openMenubar} />
    </div>
  )
}

export default Navbar
