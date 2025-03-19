import React, { useEffect } from 'react'
import login from '../assets/login.jpg'
import food_mess from '../assets/food_mess1.png'
import food_bg from '../assets/bg.png'
import logo from '../assets/logo2.png'
import { IoIosCloseCircle } from "react-icons/io";
import { MessContext } from '../GlobalContext/Context'
import { useNavigate } from 'react-router-dom'
import buddy from "../assets/buddy'sKitchen.png"

const Login = () => {

   const [loginData, setLoginData] = React.useState({})
   const [forgotPasswordModal, setForgotPasswordModal] = React.useState(false)
   const [forgotpasswordChange, setForgotPasswordChange] = React.useState({})
   const { setIsLogin,isLogin } = React.useContext(MessContext)
   const Navigate = useNavigate()
   const [usersData, setUsersData] = React.useState([
      {
         mobile_number: 123,
         email: 'admin',
         role: 'admin',
         password: '123456'
      },
      {
         mobile_number: 1234,
         email: 'user',
         role: 'user',
         password: '123456'
      }
   ])


   useEffect(() => {
      moveToDashboard();
   }, [isLogin])

   const moveToDashboard = () => {
         if (loginData.mobile_number == usersData[0].mobile_number && usersData[0].password === '123456') {
            localStorage.setItem('role', 'admin')
            Navigate('/layout/admin/dashboard')
         } else if (loginData.mobile_number == usersData[1].mobile_number && loginData.password === usersData[1].password) {
            localStorage.setItem('role', 'user')
            Navigate('/layout/user/dashboard')
         }
   }

   //collect input data :
   const handleChange = (e) => {
      setLoginData({ ...loginData, [e.target.name]: e.target.value })
   }

   const handleSubmit = () => {
      console.log(loginData);
      setIsLogin(true)
   }

   const handleForgotpasswordChange = (e) => {
      setForgotPasswordChange({ ...forgotpasswordChange, [e.target.name]: e.target.value })
   }

   const handleForgotPasswordChangeSubmit = () => {
      console.log(forgotpasswordChange);
      setForgotPasswordModal(false)
   }

   return (
      <div className='w-full min-h-screen bg-background flex font-poppins'>
         <div className='w-full bg-primary flex justify-center items-center max-lg:hidden'>
            {/* <img src={food_mess} alt="" width={400}/> */}
            <p className='max-w-[450px] text-[40px] font-semibold text-text font-poppins'>Join the mess, skip the stress—delicious meals made easy!</p>
         </div>
         <div className='w-full flex justify-center items-center relative overflow-hidden'>
            <div className='absolute top-0 left-0 right-0 bottom-0 opacity-90  lg:hidden'>
               <img src={food_bg} alt="" className='min-h-screen object-cover' />
            </div>
            <div className='min-w-[250px] max-w-[450px] border-gray-400 border-[1px] rounded-md p-2 z-10 bg-white shadow-lg'>
               <div className='flex flex-col items-center'>
                  <div className='w-[60px] h-[60px] rounded-full border-[1px] p-2'>
                     <img src={buddy} alt="" width={45} className='object-contain' />
                  </div>
                  <p className='text-subheading font-semibold text-primary'>DineFlow</p>
               </div>
               <div className='flex flex-col gap-2 mt-3 text-bodyText'>
                  <div className='p-2 rounded-md border-[1px] '>
                     <input type="number" placeholder='Mobile Number' className='outline-none' name='mobile_number' onChange={handleChange} />
                  </div>
                  <div className='p-2 rounded-md border-[1px]'>
                     <input type="password" placeholder='Password' className='outline-none' name='password' onChange={handleChange} />
                  </div>
                  <p className='text-end text-smallText cursor-pointer text-gray-600 hover:text-black' onClick={() => setForgotPasswordModal(!forgotPasswordModal)}>Forgot Password ?</p>
                  <div>
                     <button className='w-full p-2 rounded-md bg-primary text-text font-medium hover:bg-primaryhover mt-1' onClick={handleSubmit}>Login</button>
                  </div>
                  <div>
                     <p className='max-w-[200px] text-smallText text-gray-500 text-center mt-2'> To Register , contact- {9890353653}</p>
                  </div>
               </div>
            </div>

            {
               forgotPasswordModal &&
               <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
                  <div className='min-h-[120px] w-[280px] bg-white rounded-md p-2 shadow-md '>
                     <div className='flex justify-between items-center'>
                        <p className='text-bodyText font-medium text-black p-2'>Forgot Password</p>
                        <div><IoIosCloseCircle size={20} className='cursor-pointer' onClick={() => setForgotPasswordModal(!forgotPasswordModal)} /></div>
                     </div>
                     <input type="number" placeholder='Enter Mobile Number' className='outline-none p-2 rounded-md border-[1px] w-full mt-1' name='mobile_number' onChange={handleForgotpasswordChange} />
                     <button className='w-full p-2 rounded-md bg-primary text-text font-medium hover:bg-primaryhover mt-2' onClick={handleForgotPasswordChangeSubmit}>Submit</button>
                  </div>
               </div>
            }
         </div>
      </div>
   )
}

export default Login
