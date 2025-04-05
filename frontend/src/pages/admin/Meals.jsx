import React, { useEffect, useState } from 'react';
// import MealsTable from '../../components/MealsTable';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchButton from '../../components/searchButton';
import { DatePicker, Space } from 'antd';
import MealsTable from '../../components/MealsTable';

const { RangePicker } = DatePicker;

const Meals = () => {
    const [mealDetails, setMealDetails] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [allMembers, setAllMembers] = useState([]);
    const [mealsTable,setMealsTable] = useState([]);

      useEffect(() => {
        if (sessionStorage.getItem('role') != 'admin') {
          toast.error('Not authorized');
          sessionStorage.clear();
          window.location.href = '/';
        }
      },[])

    useEffect(() => {
        fetchMealDashDetails();
        fetchMembers();
    }, []);

    useEffect(()=>{
        getMealsDetails();
    },[mealDetails, allMembers])

    const fetchMealDashDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/meal/getAllMeals`);
            if (response.data.success) {
                setMealDetails(response.data.data);
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

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/members/getAllMembers`);
            if (response.data.success) {
                setAllMembers(response.data.data);
            }
            else {
                toast.error(response.data.message);
            }
        }
        catch (err) {
            console.log(err);
            toast.error('Error in fetching members');
        }
    }

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            const [startDate, endDate] = dates;
            // Filter the data based on the selected date range
            const filteredData = mealsTable.filter(meal => {
                const mealDate = new Date(meal.date);
                return mealDate >= startDate.startOf('day').toDate() && 
                       mealDate <= endDate.endOf('day').toDate();
            });
            setSearchedData(filteredData);
        } else {
            // If no date range is selected, show all data
            setSearchedData(dashboardMealDetails);
            
        }
    };

    const getMealsDetails = ()=>{
        let arr = [];
        for(let meal of mealDetails){
            const member = allMembers.filter((member) => member?.mobileNumber === meal?.mobileNumber);
            if(member){
                arr.push({
                    ...meal,
                    name: member[0]?.name,
                })
            }
            setSearchedData(arr);
            setMealsTable(arr);
        }
      }

    return (
        <div className='w-full min-h-[85vh] font-poppins md:px-[30px] max-md:px-[10px] mt-[100px]'>
            {/* Meals Table */}
            <div className='border-[1px] rounded-md p-4 mt-10'>
                {/* Table Heading */}
                <div className='w-full flex justify-between items-center gap-3'>
                    <div className='w-full'>
                        <div className='text-subheading font-semibold max-md:text-[20px]'>Meals</div>
                        <p className='text-smallText'>Meal records of the Mess</p>
                    </div>
                </div>

                <div className='flex w-full justify-between mt-6 gap-4 mb-3 flex-wrap'>
                    {/* search button */}
                    <div className='flex-1 min-w-[200px]'>
                        <SearchButton
                            dashboardMemberDetails={mealsTable}
                            setSearchedData={setSearchedData}
                        />
                    </div>
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

                <div className='mt-4'>
                    <MealsTable meals={searchedData} />
                </div>
            </div>
        </div>
    );
};

export default Meals;