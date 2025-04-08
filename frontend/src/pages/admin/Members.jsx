import React, { useEffect, useState } from 'react';
import MembersTable from '../../components/MembersTable';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchButton from '../../components/searchButton';
import { DatePicker, Space, Button } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const Members = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobileNumber: '',
        permanentAddress: '',
        hostelAddress: '',
        status: '',
        college: '',
        password: '',
        email: '',
    });
    const [dashboardMemberDetails, setDashboardMemberDetails] = useState([]);
    const [searchedData, setSearchedData] = React.useState([]);
    const [dateRange, setDateRange] = useState(null);

    useEffect(() => {
        fetchMemberDashDetails();
    }, []);

      useEffect(() => {
        if (sessionStorage.getItem('role') != 'admin') {
          toast.error('Not authorized');
          sessionStorage.clear();
          window.location.href = '/';
        }
      },[])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchMemberDashDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/meal/fetchUserMealDetails`);
            if (response.data.success) {
                setDashboardMemberDetails(response.data.data);
                setSearchedData(response.data.data); // Initialize searchedData with all data
            }
            else {
                toast.error(response.data.message);
            }
        }
        catch (err) {
            console.log(err);
            toast.error('error in fetching members');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //send Data to api:
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/members/registerMember`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                toast.success('Member registered successfully');
                fetchMemberDashDetails(); // Refresh the data after adding a new member
            }
        }
        catch (err) {
            console.log(err);
            toast.error('error in registering member');
        }
        setIsModalOpen(false);
    };

    return (
        <div className='w-full min-h-[85vh] font-poppins md:px-[30px] max-md:px-[10px] mt-[100px]'>
            {/* Members Table */}
            <div className='border-[1px] rounded-md p-4 mt-10'>
                {/* Table Heading */}
                <div className='w-full flex justify-between items-center gap-3'>
                    <div className='w-full'>
                        <div className='text-subheading font-semibold max-md:text-[20px]'>Members</div>
                        <p className='text-smallText'>Members of Mess</p>
                    </div>
                    {/* addMember button  */}
                    <div className='text-bodyText md:hidden'>
                        <button
                            className='bg-primary text-text hover:bg-primaryhover py-2 px-2 rounded-md flex gap-1 items-center max-h-12 w-[140px] max-md:max-w-[140px]'
                            onClick={() => setIsModalOpen(true)}
                        >
                            <MdOutlineAddCircleOutline />
                            <p>Add Member</p>
                        </button>
                    </div>
                </div>

                <div className='flex w-full justify-between mt-6  gap-4 mb-3 flex-wrap'>
                    {/* search button  */}
                    <div className='flex-1 min-w-[200px]'>
                        <SearchButton
                            dashboardMemberDetails={dashboardMemberDetails}
                            setSearchedData={setSearchedData}
                        />
                    </div>
                    {/* addMember button  */}
                    <div className='text-bodyText max-md:hidden'>
                        <button
                            className='bg-primary text-text hover:bg-primaryhover py-2 px-2 rounded-md flex gap-1 items-center max-h-12 w-[140px] max-md:max-w-[140px]'
                            onClick={() => setIsModalOpen(true)}
                        >
                            <MdOutlineAddCircleOutline />
                            <p>Add Member</p>
                        </button>
                    </div>
                </div>

                <div className='mt-4'>
                    <MembersTable members={searchedData} fetchMemberDashDetails={fetchMemberDashDetails}/>
                </div>
            </div>

            {/* Add Member Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white p-6 rounded-lg w-[400px] m-2'>
                        <h2 className='text-xl font-semibold mb-4'>Add Member</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                            <input type='text' name='name' placeholder='Name' value={formData.name} onChange={handleChange} className='border p-2 rounded' />
                            <input type='text' name='mobileNumber' placeholder='Mobile Number' value={formData.mobileNumber} onChange={handleChange} className='border p-2 rounded' />
                            <input type='text' name='permanentAddress' placeholder='Permanent Address' value={formData.permanentAddress} onChange={handleChange} className='border p-2 rounded' />
                            <input type='text' name='hostelAddress' placeholder='Hostel Address' value={formData.hostelAddress} onChange={handleChange} className='border p-2 rounded' />
                            <select name='status' value={formData.status} onChange={handleChange} className='border p-2 rounded'>
                                <option value=''>Subscription Status</option>
                                <option value='Active'>Active</option>
                                <option value='Not Active'>Not Active</option>
                            </select>
                            <input type='text' name='college' placeholder='College' value={formData.college} onChange={handleChange} className='border p-2 rounded' />
                            <input type='text' name='email' placeholder='Email' value={formData.email} onChange={handleChange} className='border p-2 rounded' />
                            <input type='text' name='password' placeholder='Password' value={formData.password} onChange={handleChange} className='border p-2 rounded' />
                            <div className='flex justify-end gap-2 mt-4'>
                                <button type='button' onClick={() => setIsModalOpen(false)} className='bg-gray-400 text-white px-3 py-2 rounded'>Close</button>
                                <button type='submit' className='bg-primary text-white px-3 py-2 rounded'>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;