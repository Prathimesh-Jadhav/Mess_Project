import React from 'react'
import food from '../assets/food_mess.png'
import LandingNav from '../components/LandingNav'

const LandingPage = () => {
  return (
    <div className='w-full min-h-screen relative'>
        <LandingNav/>
       <div className='xl:absolute top-0 xl:min-w-[50%] right-0 bottom-0 bg-gradient-to-tr bg-primary to-orange-700  z-10 xl:rounded-bl-[60%] max-xl:w-full xl:flex justify-center items-center'>
           <div>
            <img src={food} alt="" width={400} className='z-20'/>
           </div>
       </div>
       <div className='w-full min-h-screen flex justify-start px-[40px]'>
        <div>Enjoy tasty, budget-friendly meals every day—join our food mess now and make dining effortless!</div>
       </div>
    </div>
  )
}

export default LandingPage
