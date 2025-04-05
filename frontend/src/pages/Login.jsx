import React, { useEffect, useContext } from 'react'
import login from '../assets/login.jpg'
import food_mess from '../assets/food_mess1.png'
import food_bg from '../assets/bg.png'
import logo from '../assets/logo2.png'
import { IoIosCloseCircle } from "react-icons/io"
import { MessContext } from '../GlobalContext/Context'
import { useNavigate } from 'react-router-dom'
import buddy from "../assets/buddy'sKitchen.png"
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
   const [loginData, setLoginData] = React.useState({})
   const [forgotPasswordModal, setForgotPasswordModal] = React.useState(false)
   const [forgotpasswordChange, setForgotPasswordChange] = React.useState({})
   const [memberDetails, setMemberDetails] = React.useState({})
   const [loading, setLoading] = React.useState(false)

   const { setIsLogin, setRole, isLogin, role, setUserSubscriptionStatus } = useContext(MessContext)
   const navigate = useNavigate();

   const handleChange = (e) => {
      setLoginData({ ...loginData, [e.target.name]: e.target.value })
   }

   useEffect(() => {
      if (isLogin && role) {
         if (role === 'admin') {
            navigate('/layout/admin/dashboard');
         } else if (role === 'user') {
            navigate('/layout/user/dashboard');
         } else {
            toast.error('Error in setting role');
            navigate('/');
         }
      }

      getMemberDetails();
   }, [isLogin, role, navigate])

   const getMemberDetails = async () => {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/members/getMemberDetails`, { mobileNumber: sessionStorage.getItem('mobileNumber') });
         if (response.data.success) {
            setMemberDetails(response.data.data);
            setUserSubscriptionStatus(response.data.data[0]?.status);
         }
         else {
            toast.error(response.data.message);
         }
      } catch (error) {
         console.error('Error fetching member details:', error);
      }
   }

   const handleSubmit = async () => {
      setLoading(true);
      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, loginData, {
            headers: {
               'Content-Type': 'application/json'
            }
         })

         const resData = response.data.data;
         const token = response.data.token;

         if (response.data.success) {
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', resData.role);
            sessionStorage.setItem('mobileNumber', resData.mobileNumber);
            setRole(resData.role);

            if (resData.role === 'admin') {
               toast.success('Login successful');
               setIsLogin(true);
               setLoginData({});
               return;
            }

            const memberResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/members/getMemberDetails`, {
               mobileNumber: resData.mobileNumber
            }, {
               headers: { 'Content-Type': 'application/json' }
            });

            if (memberResponse.data.success) {
               const member = memberResponse.data.data[0];
               sessionStorage.setItem('startDate', member.subscibedAt.split('T')[0]);
               toast.success('Login successful');
               setIsLogin(true);
               setLoginData({});
            } else {
               toast.error('Failed to fetch member details');
            }
         } else {
            toast.error('Login failed');
         }

      } catch (err) {
         console.error(err);
         toast.error('Error in login');
      } finally {
         setLoading(false);
      }
   }

   const handleForgotpasswordChange = (e) => {
      setForgotPasswordChange({ ...forgotpasswordChange, [e.target.name]: e.target.value })
   }

   const handleForgotPasswordChangeSubmit = async () => {
      if (forgotpasswordChange.mobileNumber === undefined) {
         toast.error('Please fill all the fields')
      }

      try {
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`, forgotpasswordChange, {
            headers: {
               'Content-Type': 'application/json'
            }
         })
         if (response.data.success) {
            toast.success('Reset Mail sent successfully');
         }
         else {
            toast.error('Failed to send Mail');
         }
      }
      catch (err) {
         console.error(err);
         toast.error('Error in sending mail');
      }
      setForgotPasswordModal(false)
   }

   return (
      <div className='w-full min-h-screen bg-background flex font-poppins'>
         <div className='w-full bg-primary flex justify-center items-center max-lg:hidden'>
            <p className='max-w-[450px] text-[40px] font-semibold text-text font-poppins'>
               Join the mess, skip the stress—delicious meals made easy!
            </p>
         </div>

         <div className='w-full flex justify-center items-center relative overflow-hidden'>
            <div className='absolute top-0 left-0 right-0 bottom-0 opacity-90 lg:hidden'>
               <img src={food_bg} alt="" className='min-h-screen object-cover' />
            </div>

            <div className='min-w-[250px] max-w-[450px] border-gray-400 border-[1px] rounded-md p-2 z-10 bg-white shadow-lg'>
               <div className='flex flex-col items-center'>
                  <div className='w-[60px] h-[60px] rounded-full border-[1px] p-2'>
                     <img src={buddy} alt="" width={45} className='object-contain' />
                  </div>
                  <p className='text-[20px] font-semibold text-primary mt-1'>Buddy's Kitchen</p>
               </div>

               <div className='flex flex-col gap-2 mt-3 text-bodyText'>
                  <div className='p-2 rounded-md border-[1px]'>
                     <input
                        type="text"
                        placeholder='Mobile Number'
                        className='outline-none'
                        name='mobileNumber'
                        onChange={handleChange}
                     />
                  </div>
                  <div className='p-2 rounded-md border-[1px]'>
                     <input
                        type="password"
                        placeholder='Password'
                        className='outline-none'
                        name='password'
                        onChange={handleChange}
                     />
                  </div>
                  <p className='text-end text-smallText cursor-pointer text-gray-600 hover:text-black'
                     onClick={() => setForgotPasswordModal(true)}>
                     Forgot Password?
                  </p>
                  <button
                     className='w-full p-2 rounded-md bg-primary text-text font-medium hover:bg-primaryhover mt-1 flex items-center justify-center gap-2'
                     onClick={handleSubmit}
                     disabled={loading}
                  >
                     {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                        'Login'
                     )}
                  </button>
                  <p className='max-w-[200px] text-smallText text-gray-500 text-center mt-2'>
                     To Register, contact - 9890353653
                  </p>
               </div>
            </div>

            {forgotPasswordModal && (
               <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
                  <div className='min-h-[120px] w-[280px] bg-white rounded-md p-2 shadow-md'>
                     <div className='flex justify-between items-center'>
                        <p className='text-bodyText font-medium text-black p-2'>Forgot Password</p>
                        <IoIosCloseCircle
                           size={20}
                           className='cursor-pointer'
                           onClick={() => setForgotPasswordModal(false)}
                        />
                     </div>
                     <input
                        type="number"
                        placeholder='Enter Mobile Number'
                        className='outline-none p-2 rounded-md border-[1px] w-full mt-1'
                        name='mobileNumber'
                        onChange={handleForgotpasswordChange}
                     />
                     <button
                        className='w-full p-2 rounded-md bg-primary text-text font-medium hover:bg-primaryhover mt-2'
                        onClick={handleForgotPasswordChangeSubmit}>
                        Submit
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

export default Login
