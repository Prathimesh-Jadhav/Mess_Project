import React from 'react'
import MemberMealsTable from '../../components/MemberMealsTable'

const MealDetails = () => {
  return (
    <div className='w-full min-h-[60vh] font-poppins px-[30px] mt-[80px]'>

        {/* table  */}
        <div className='border-[1px] border-gray-400 rounded-md mt-4 p-4 max-h-[400px]'>
           {/* heading  */}
           <div >
              <p className='text-[20px] font-semibold'>My Meals</p>
              <p className='text-gray-600 text-[14px]'>Check out your meals of this month</p>
           </div>

           {/* Meals Table  */}
           <div  className='mt-4'>
               <MemberMealsTable/>
           </div>
        </div>
    </div>
  )
}

export default MealDetails
