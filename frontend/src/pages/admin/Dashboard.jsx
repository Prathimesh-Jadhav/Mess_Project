
import React, { useState, useContext, useEffect } from 'react';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoQrCodeOutline } from "react-icons/io5";
import { keyStats } from '../../data';
import KeyStatsDiv from '../../components/KeyStats';
import { MessContext } from '../../GlobalContext/Context';
import MembersAdminDashTable from '../../components/MembersAdminDashTable';
import PendingAdminDashTable from '../../components/PendingAdminDashTable';
import SetMenu from '../../components/SetMenu';
import QRCode from 'qrcode';
import axios from 'axios';
import { toast } from 'react-toastify';
import RecentDashMeals from '../../components/RecentDashMeals';

const Dashboard = () => {
  const { role, mealRate, adminDetails } = useContext(MessContext);
  const [optionSelected, setOptionSelected] = useState('Meals');
  const [openQR, setOpenQR] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberData, setMemberData] = useState({
    name: '',
    mobileNumber: '',
    permanentAddress: '',
    hostelAddress: '',
    status: '',
    college: '',
    password: '',
    email:'',
  });
  const [qrData, setQrData] = useState("mobileNumber:123,password:123456");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [stats, setStats] = useState([]);
  const [meals, setAllMeals] = useState([]);
  const [todayMeals, setTodayMeals] = useState([]);
  const [dashboardMemberDetails, setDashboardMemberDetails] = useState([]);
  const [memberDueDetails, setMemberDueDetails] = useState([]);
  const [mealDashDetails, setMealDashDetails] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem('role') != 'admin') {
      toast.error('Not authorized');
      sessionStorage.clear();
      window.location.href = '/';
    }
  },[])


  useEffect(() => {
    generateQRCode();
  }, [qrData]);

  useEffect(() => {
    if (adminDetails) {
      setQrData(`mobileNumber:${adminDetails.mobileNumber},password:${adminDetails.password}`);
    }
  }, [adminDetails])


  /**
   * Handles changes to the new member form.
   * Updates the state variable memberData with the new values.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
   */
  const handleInputChange = (e) => {
    setMemberData({ ...memberData, [e.target.name]: e.target.value });
  };

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(qrData);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  //fetchallMembers:
  useEffect(() => {
    fetchMembers()
    fetchAllMeals();
    fetchMemberDashDetails();
    getMemberDueDetails();
  }, [])

  useEffect(()=>{
    getMealsDashDetails();
  },[allMembers])

  useEffect(() => {
    updateKeyStats();
  }, [allMembers, meals, todayMeals])

  const getMealsDashDetails = ()=>{
    let arr = [];
    for(let meal of meals){
        const member = allMembers.filter((member) => member.mobileNumber === meal.mobileNumber);
        if(member){
            arr.push({
                ...meal,
                name: member[0].name,
            })
        }
        setMealDashDetails(arr);
    }
  }

  const updateKeyStats = () => {
    const data = keyStats[role].map((item) => {
      if (item.heading === 'Total Active Members') {
        return { ...item, value: allMembers.length }
      }
      else if (item.heading === 'Meal Sold Today') {
        //sum all the totalMealsHad from todayMeals
        const totalMealsHad = todayMeals.reduce((total, meal) => {
          return total + meal.totalMealsHad;
        }, 0);
        return { ...item, value: totalMealsHad }
      }
      else if (item.heading === 'Today\'s Revenue') {
        //sum all the totalMealsHad from todayMeals
        const totalMealsHad = todayMeals.reduce((total, meal) => {
          return total + meal.totalMealsHad;
        }, 0);
        return { ...item, value: totalMealsHad * mealRate }
      }
      else {
        return item;
      }
    })
    setStats(data);
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
      toast.error('error in fetching members');
    }
  }

  const fetchAllMeals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/meal/getAllMeals`);
      if (response.data.success) {
        setAllMeals(response.data.data);

        //filter todays meals:
        const todaysMeals = response.data.data.filter((meal) => {
          return new Date(meal.date).toDateString() === new Date().toDateString();
        })
        setTodayMeals(todaysMeals);
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch (err) {
      console.log(err);
      toast.error('error in fetching meals');
    }
  }

  //fetch MemberDash Details:
  const fetchMemberDashDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/meal/fetchUserMealDetails`);
      if (response.data.success) {
        setDashboardMemberDetails(response.data.data);
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

  const getMemberDueDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/meal/getTotalDueForMembers`);
      if (response.data.success) {
        setMemberDueDetails(response.data.data);
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  /**
   * Handles submitting a new member form.
   * Makes a POST request to the /api/members API endpoint with the member data.
   * If the request is successful, hides the add member form and resets the form data.
   * If the request fails, logs an error message to the console.
   */
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/members/registerMember`, memberData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(response.data.success){
        toast.success('Member registered successfully');
        setShowAddMember(false);
        setMemberData({});
        fetchMembers();
        fetchMemberDashDetails();
        getMemberDueDetails();
      }
    }
    catch (err) {
      console.log(err);
      toast.error('error in registering member');
    }
  };


  const optionTaglines = {
    Meals: 'Recently added Meals',
    Pending: 'Members who have not paid yet',
    Menu: "Set today's menu"
  };

  return (
    <div className='w-full min-h-[60vh] font-poppins px-6 mt-[80px] '>
      {/* Heading */}
      <div className='flex justify-between items-center mt-6'>
        <p className='md:text-3xl max-md:text-2xl font-semibold'>Dashboard</p>
        <div className='flex gap-3'>
          {/* Add Member Button */}
          <button
            className='bg-primary text-white hover:bg-primaryhover py-2 px-4 rounded-lg flex gap-2 items-center shadow-md max-md:hidden'
            onClick={() => setShowAddMember(true)}
          >
            <MdOutlineAddCircleOutline size={20} />
            <p>Add Member</p>
          </button>
          {/* QR Code Button */}
          <button
            className='bg-primary text-white hover:bg-primaryhover py-2 px-4 rounded-lg flex gap-2 items-center shadow-md'
            onClick={() => setOpenQR(true)}>
            <IoQrCodeOutline size={20} />
            <p>Show QR</p>
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className='mt-8 flex flex-wrap gap-6'>
        {stats?.map((item, index) => (
          <KeyStatsDiv key={index} heading={item.heading} value={item.value} Logo={item.logo} tag={item.tag} />
        ))}
      </div>

      {/* Members, Pending, Menu */}
      <div className='w-full mt-8'>
        <div className='bg-background rounded-md p-2 flex items-center max-w-[300px] gap-2 shadow-md'>
          {['Meals', 'Pending', 'Menu'].map(option => (
            <div
              key={option}
              className={`cursor-pointer text-gray-500 px-3 py-2 rounded-md transition-all ${optionSelected === option ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setOptionSelected(option)}>
              {option}
            </div>
          ))}
        </div>

        <div className='w-full rounded-md p-6 border mt-4 shadow-md '>
          <p className='text-xl font-semibold'>{optionSelected}</p>
          <p className='text-sm text-gray-500'>{optionTaglines[optionSelected]}</p>
          <div className='mt-4 overflow-x-auto'>
            {optionSelected === 'Meals' && <RecentDashMeals mealDetails={mealDashDetails} />}
            {optionSelected === 'Pending' && <PendingAdminDashTable memberDueDetails={memberDueDetails} />}
            {optionSelected === 'Menu' && <SetMenu />}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {openQR && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-md shadow-lg w-[300px] text-center m-2'>
            <h2 className='text-xl font-semibold mb-4'>Scan QR Code</h2>
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />}
            <div className='flex justify-between mt-4'>
              <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => setOpenQR(false)}>Close</button>
              <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={generateQRCode}>Regenerate QR</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-md shadow-lg w-[400px] m-4'>
            <h2 className='text-xl font-semibold mb-4'>Add Member</h2>
            <input className='w-full p-2 mb-3 border rounded-md' type='text' name='name' placeholder='Name' value={memberData.name} onChange={handleInputChange} />
            <input className='w-full p-2 mb-3 border rounded-md' type='text' name='mobileNumber' placeholder='Mobile Number' value={memberData.mobile} onChange={handleInputChange} />
            <input className='w-full p-2 mb-3 border rounded-md' type='text' name='permanentAddress' placeholder='Native Place' value={memberData.nativePlace} onChange={handleInputChange} />
            <input className='w-full p-2 mb-3 border rounded-md' type='text' name='hostelAddress' placeholder='Accommodation Address' value={memberData.address} onChange={handleInputChange} />
            <select className='w-full p-2 mb-3 border rounded-md' name='status' value={memberData.status} onChange={handleInputChange}>
              <option value='' disabled >Subscription Status</option>
              <option value='Active'>Active</option>
              <option value='Not Active'>Not Active</option>
            </select>
            <input className='w-full p-2 mb-4 border rounded-md' type='text' name='college' placeholder='College' value={memberData.college} onChange={handleInputChange} />
            <input className='w-full p-2 mb-4 border rounded-md' type='email' name='email' placeholder='Email' value={memberData.email} onChange={handleInputChange} />
            <input className='w-full p-2 mb-4 border rounded-md' type='password' name='password' placeholder='Password' value={memberData.password} onChange={handleInputChange} />
            <div className='flex justify-end items-center gap-2'>
              <button className='bg-gray-300 text-black px-4 py-2 rounded-md' onClick={() => setShowAddMember(false)}>Close</button>
              <button className='bg-primary text-white px-4 py-2 rounded-md' onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;