import React, { useState, useContext, useEffect } from 'react';
import { IoQrCodeOutline } from "react-icons/io5";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { keyStats } from '../../data';
import KeyStatsDiv from '../../components/KeyStats';
import { MessContext } from '../../GlobalContext/Context';
import MemberMealsTable from '../../components/MemberMealsTable';
import { FaUtensils, FaSun, FaMoon } from 'react-icons/fa'; // Icons for meal timings
import MemberMealsDashTable from '../../components/MemberMealsDashTable';
import axios from 'axios';
import { FaTowerBroadcast } from 'react-icons/fa6';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [openQR, setOpenQR] = useState(false);
  const [qrResult, setQrResult] = useState('');
  const { role, adminDetails, mealRate,setIsLogin } = useContext(MessContext);
  const [mealDetails, setMealDetails] = useState([]);
  const [stats, setStats] = useState([]);
  const [memberDetails, setMemberDetails] = useState({});
  const [messDetails, setMessDetails] = useState({});
  const [menuDetails, setMenuDetails] = useState({});
  const [memberMeals, setMemberMeals] = useState([]);

  const Navigate = useNavigate();

  useEffect(() => {

    if (openQR) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250
      });

      scanner.render(
        (decodedText) => {
          if(sessionStorage.getItem('mobileNumber') == null && sessionStorage.getItem('role') !='user'){
            toast.error('Please login first')
            return;
          }
          setQrResult(decodedText);
          setOpenQR(false);
          alert(`Scanned QR Code: ${decodedText}`);
        },
        (errorMessage) => {
          console.log("QR Code Scan Error: ", errorMessage);
        }
      );

      return () => scanner.clear();
    }
  }, [openQR]);

  useEffect(() => {
    if (role != 'user') {
      toast.error('Not authorized');
      sessionStorage.clear();
      setIsLogin(false);
      Navigate('/');
    }
  }, [])

  useEffect(() => {
    addAmeal();
  }, [qrResult])

  useEffect(() => {
    getUserMeals();
    getMemberDetails();
    getMessDetails();
    getMenuDetails();
    getMemberMeals();
  }, [])

  useEffect(() => {
    if (
      mealDetails?.totalMealsHad !== undefined &&
      memberDetails[0]?.status === 'Active' &&
      mealRate !== undefined
    ) {
      updateKeyStats();
    }
  }, [mealDetails, memberDetails, mealRate]);

  const updateKeyStats = () => {
    if (!mealDetails || !memberDetails || !messDetails) {
      console.log("Data not yet loaded");
      return;
    }

    const data = keyStats[role]?.map((item) => {
      if (item.heading === 'Total Meals') {
        return { ...item, value: mealDetails?.totalMealsHad || 0 };
      } else if (item.heading === 'Total Cost') {
        const totalMealsHadCost = (mealDetails?.totalMealsHad || 0) * (mealRate || 0);
        return { ...item, value: totalMealsHadCost, tag: `@${mealRate} per meal` };
      } else if (item.heading === 'Subscription Status') {
        return { ...item, value: memberDetails[0]?.status || "Unknown" };
      } else {
        return item;
      }
    });
    setStats(data);
  };

  const getMemberDetails = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/members/getMemberDetails`, { mobileNumber: sessionStorage.getItem('mobileNumber') });
      if (response.data.success) {
        setMemberDetails(response.data.data);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error(error.response.data.message);
    }
  };

  const getUserMeals = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/meal/getMealDetails`, { mobileNumber: sessionStorage.getItem('mobileNumber') });
      if (response.data.success) {
        setMealDetails(response.data.data);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error(error.response.data.message);
    }
  };

  const getMessDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messDetails/getMessDetails`);
      if (response.data.success) {
        setMessDetails(response.data.data);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error(error.response.data.message);
    }
  };

  const getMemberMeals = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/meal/getAllMealsOfMember`, { mobileNumber: sessionStorage.getItem('mobileNumber') });
      if (response.data.success) {
        setMemberMeals(response.data.data);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error(error.response.data.message);
    }
  };


  const getMenuDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/menu/getTodaysMenu`);
      if (response.data.success) {
        setMenuDetails(response.data.data[0]);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  }


  const addAmeal = async () => {
    if (!qrResult) {
      return;
    }
    if (qrResult != `mobileNumber:${adminDetails.mobileNumber},password:${adminDetails.password}`) {
      toast.error('invalid QR');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/meal/addMeal`, { mobileNumber: sessionStorage.getItem('mobileNumber') });
      if (response.data.success) {
        toast.success('Meal added successfully');
        getUserMeals();
        getMemberMeals();
        getMemberDetails();
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error(error.response.data.message);
    }
    setQrResult('');
  };

  return (
    <div className='w-full min-h-[85vh] font-poppins px-[30px] relative mt-[80px]'>
      <div className='flex justify-between items-center mt-6 gap-2'>
        <p className='text-[28px] max-md:text-[22px] font-semibold'>Dashboard</p>
        <button
          className='bg-primary text-white hover:bg-primaryhover py-2 px-4 rounded-lg flex gap-2 items-center shadow-md transition-all duration-200'
          onClick={() => setOpenQR(true)}>
          <IoQrCodeOutline className="text-2xl" />
          <p>Scan QR</p>
        </button>
      </div>

      {/* QR Code Scanner Modal */}
      {openQR && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-[400px] flex flex-col items-center">
            <p className="text-lg font-semibold mb-4">Scan QR Code</p>
            <div id="qr-reader" className="w-full border-2 border-gray-300 rounded-lg shadow-md"></div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              onClick={() => setOpenQR(false)}>
              Close Scanner
            </button>
          </div>
        </div>
      )}

      {/* Display QR Code Result */}
      {qrResult && (
        <div className='mt-4 p-3 bg-green-100 text-green-800 rounded-lg shadow-md'>
          <p className="font-medium">Scanned QR Code:</p>
          <p className="text-lg">QR scanned successfully</p>
        </div>
      )}

      {/* Key Stats */}
      <div className='mt-10 flex flex-wrap gap-4 items-center'>
        {stats?.map((item, index) => (
          <KeyStatsDiv key={index} heading={item.heading} value={item.value} Logo={item.logo} tag={item.tag} />
        ))}
      </div>

      {/* Today's Meal in Mess */}
      <div className='mt-8 p-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg'>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-2xl font-semibold">Today's Special</p>
          </div>
          <p className="text-lg font-medium">
            Today's special in the mess is <strong>{menuDetails?.riceRoti} with flavorful {menuDetails?.curry}, served with special {menuDetails?.specialItems}!</strong>.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <FaUtensils className="text-3xl" />
            <p className="text-md font-medium">Enjoy your meal!</p>
          </div>
        </div>
      </div>

      {/* Mess Timings Card */}
      <div className="mt-8 p-6 bg-gray-200 rounded-2xl border-[1px] border-gray-300">
        <div className="flex flex-col items-center text-center">
          <p className="text-2xl font-semibold mb-4 ">Mess Timings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Lunch Timing */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <FaSun className="text-3xl text-yellow-500" />
              <div className="text-left">
                <p className="text-lg font-medium">Lunch</p>
                <p className="text-sm text-gray-600">{messDetails[0]?.lunchTiming}</p>
              </div>
            </div>
            {/* Dinner Timing */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <FaMoon className="text-3xl text-blue-500" />
              <div className="text-left">
                <p className="text-lg font-medium">Dinner</p>
                <p className="text-sm text-gray-600">{messDetails[0]?.dinnerTiming}</p>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Member's daily meals in the month */}
      <div>
        <div className='border-[1px] border-gray-300 rounded-md mt-10 p-4'>
          <p className='text-[24px] font-semibold'>Your Meals in this Month</p>
          <div className='mt-4 overflow-x-auto '>

            <MemberMealsDashTable memberMeals={memberMeals} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;