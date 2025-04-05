import React, { useContext, useEffect, useState } from 'react'
import MemberMealsTable from '../../components/MemberMealsTable'
import axios from 'axios'
import {toast} from 'react-toastify'
import SearchButton from '../../components/searchButton'
import { DatePicker, Space } from 'antd';
import { MessContext } from '../../GlobalContext/Context'
import { useNavigate } from 'react-router-dom'

const { RangePicker } = DatePicker;

const MealDetails = () => {

  const [userMealDetails, setUserMealDetails] = useState([])
  const [searchedData, setSearchedData] = useState([])
  const [dateRange, setDateRange] = useState(null)
  const {role, setIsLogin} = useContext(MessContext)
  const Navigate = useNavigate()

  useEffect(() => {
    fetchUserMeals()
  }, [])

  
    useEffect(() => {
      if (role != 'user') {
        toast.error('Not authorized');
        sessionStorage.clear();
        setIsLogin(false);
        Navigate('/');
      }
    }, [])

  const fetchUserMeals = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/meal/getAllMealsOfMember`, {mobileNumber: sessionStorage.getItem('mobileNumber')});
      if (response.data.success) {
        setUserMealDetails(response.data.data);
        setSearchedData(response.data.data);
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch (err) {
      console.log(err);
      toast.error('Error in fetching meals');
    }
  }

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
        const [startDate, endDate] = dates;
        // Filter the data based on the selected date range
        const filteredData = userMealDetails.filter(meal => {
            const mealDate = new Date(meal.date);
            return mealDate >= startDate.startOf('day').toDate() && 
                   mealDate <= endDate.endOf('day').toDate();
        });
        setSearchedData(filteredData);
    } else {
        // If no date range is selected, show all data
        setSearchedData(userMealDetails);
        
    }
};

  return (
    <div className='w-full min-h-[60vh] font-poppins px-[30px] mt-[80px]'>

        {/* table  */}
        <div className='border-[1px] border-gray-400 rounded-md mt-4 p-4 max-h-[400px]'>
           {/* heading  */}
           <div >
              <p className='text-[20px] font-semibold'>My Meals</p>
              <p className='text-gray-600 text-[14px]'>Check out your meals of this month</p>
           </div>

           <div className='flex justify-end items-center mt-4 px-2 flex-wrap gap-2'>

                    {/* date range picker */}
                    <div className='text-bodyText'>
                        <RangePicker 
                            onChange={handleDateRangeChange}
                            className='border p-2 rounded-md'
                            placeholder={['Start Date', 'End Date']}
                            format="YYYY-MM-DD"
                        />
                    </div>
           </div>

           {/* Meals Table  */}
           <div  className='mt-4'>
               <MemberMealsTable userMealDetails={searchedData}/>
           </div>
        </div>
    </div>
  )
}

export default MealDetails
