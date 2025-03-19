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

const Dashboard = () => {
  const { role } = useContext(MessContext);
  const [optionSelected, setOptionSelected] = useState('Members');
  const [openQR, setOpenQR] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberData, setMemberData] = useState({
    name: '',
    mobile: '',
    nativePlace: '',
    address: '',
    status: 'Active',
    college: '',
    password:''
  });
  const [qrData, setQrData] = useState("mobileNumber:123,password:123456");
  const [qrCodeUrl, setQrCodeUrl] = useState("");


  useEffect(() => {
    generateQRCode();
  }, []);

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
      const url = await QRCode.toDataURL("mobileNumber:123,password:123456");
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Handles submitting a new member form.
   * Makes a POST request to the /api/members API endpoint with the member data.
   * If the request is successful, hides the add member form and resets the form data.
   * If the request fails, logs an error message to the console.
   */
  const handleSubmit = async () => {
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      setShowAddMember(false);
      setMemberData({ name: '', mobile: '', nativePlace: '', address: '', status: 'Active', college: '' });
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };


  const optionTaglines = {
    Members: 'All members of the mess',
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
        {keyStats[role].map((item, index) => (
          <KeyStatsDiv key={index} heading={item.heading} value={item.value} Logo={item.logo} tag={item.tag} />
        ))}
      </div>

      {/* Members, Pending, Menu */}
      <div className='w-full mt-8'>
        <div className='bg-background rounded-md p-2 flex items-center max-w-[300px] gap-2 shadow-md'>
          {['Members', 'Pending', 'Menu'].map(option => (
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
            {optionSelected === 'Members' && <MembersAdminDashTable />}
            {optionSelected === 'Pending' && <PendingAdminDashTable />}
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
            <input className='w-full p-3 mb-3 border rounded-md' type='text' name='name' placeholder='Name' value={memberData.name} onChange={handleInputChange} />
            <input className='w-full p-3 mb-3 border rounded-md' type='text' name='mobile' placeholder='Mobile Number' value={memberData.mobile} onChange={handleInputChange} />
            <input className='w-full p-3 mb-3 border rounded-md' type='text' name='nativePlace' placeholder='Native Place' value={memberData.nativePlace} onChange={handleInputChange} />
            <input className='w-full p-3 mb-3 border rounded-md' type='text' name='address' placeholder='Accommodation Address' value={memberData.address} onChange={handleInputChange} />
            <select className='w-full p-3 mb-3 border rounded-md' name='status' value={memberData.status} onChange={handleInputChange}>
              <option value='Active'>Active</option>
              <option value='Not Active'>Not Active</option>
            </select>
            <input className='w-full p-3 mb-4 border rounded-md' type='text' name='college' placeholder='College' value={memberData.college} onChange={handleInputChange} />
            <input className='w-full p-3 mb-4 border rounded-md' type='password' name='password' placeholder='Password' value={memberData.password} onChange={handleInputChange} />
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