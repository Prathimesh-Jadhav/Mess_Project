import React, { useState, useContext, useEffect } from 'react';
import { IoQrCodeOutline } from "react-icons/io5";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { keyStats } from '../../data';
import KeyStatsDiv from '../../components/KeyStats';
import { MessContext } from '../../GlobalContext/Context';
import MemberMealsTable from '../../components/MemberMealsTable';
import { FaUtensils, FaSun, FaMoon } from 'react-icons/fa'; // Icons for meal timings

const Dashboard = () => {
  const { role } = useContext(MessContext);
  const [openQR, setOpenQR] = useState(false);
  const [qrResult, setQrResult] = useState('');

  useEffect(() => {
    if (openQR) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250
      });

      scanner.render(
        (decodedText) => {
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
          <p className="text-lg">{qrResult}</p>
        </div>
      )}

      {/* Key Stats */}
      <div className='mt-10 flex flex-wrap gap-4 items-center'>
        {keyStats[role].map((item, index) => (
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
            Today's special in the mess is <strong>Paneer Butter Masala with Roti</strong>.
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
                <p className="text-sm text-gray-600">12:00 PM - 2:00 PM</p>
              </div>
            </div>
            {/* Dinner Timing */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <FaMoon className="text-3xl text-blue-500" />
              <div className="text-left">
                <p className="text-lg font-medium">Dinner</p>
                <p className="text-sm text-gray-600">7:00 PM - 9:00 PM</p>
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

          <MemberMealsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;