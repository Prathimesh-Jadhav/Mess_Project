import React, { useContext, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const SetMenu = () => {
  const [menu, setMenu] = useState({
    riceRoti: '',
    curry: '',
    extra: '',
    specialItems: ''
  });

  const handleChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    //set Todays Menu:
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/menu/addTodaysMenu`, menu, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if(response.data.success){
        toast.success(response.data.success);
      }
    }
    catch (err) {
      console.log(err);
      toast.error('error in setting Menu')
    }
    setMenu({
      riceRoti: '',
      curry: '',
      specialItems: ''
    })
    alert('Menu saved successfully!');
  };

  return (
    <div className='w-full  mx-auto bg-white p-6 rounded-lg'>

      <div className='flex flex-col gap-4'>
        {/* Rice/Roti */}
        <div>
          <label className='text-bodyText ml-1'>Rice/Roti</label>
          <input
            type='text'
            name='riceRoti'
            value={menu.riceRoti}
            onChange={handleChange}
            className='w-full px-3 py-2 rounded-md border-[1px] focus:outline-primary'
            placeholder='Enter rice or roti options'
          />
        </div>

        {/* Curry */}
        <div>
          <label className='text-bodyText ml-1'>Curry</label>
          <input
            type='text'
            name='curry'
            value={menu.curry}
            onChange={handleChange}
            className='w-full px-3 py-2 rounded-md border-[1px] focus:outline-primary'
            placeholder="Enter today's curry"
          />
        </div>

        {/* Special Items */}
        <div>
          <label className='text-bodyText ml-1'>Special Items</label>
          <input
            type='text'
            name='specialItems'
            value={menu.specialItems}
            onChange={handleChange}
            className='w-full px-3 py-2 rounded-md border-[1px] focus:outline-primary'
            placeholder='Enter special dish of the day'
          />
        </div>

        {/* Submit Button */}
        <button
          className='bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition-all'
          onClick={handleSubmit}
        >
          Save Menu
        </button>
      </div>
    </div>
  );
};

export default SetMenu;