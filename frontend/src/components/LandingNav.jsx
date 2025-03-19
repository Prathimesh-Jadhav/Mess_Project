import React from 'react'

const LandingNav = () => {
  return (
    <div className='w-full h-14 bg-transparent flex justify-between items-center absolute top-0 right-0 left-0 z-50 px-[40px]'>
        <div>
            <p className='text-subheading font-semibold'>DINE<span className='text-primary'>FLOW</span></p>
        </div>
        <div>
            <button className='p-[6px] rounded-md bg-white px-5 text-text font-medium'>Login</button>
        </div>
    </div>
  )
}

export default LandingNav
