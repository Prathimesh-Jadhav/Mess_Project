import React, { useState } from 'react';
import MembersTable from '../../components/MembersTable';
import { MdOutlineAddCircleOutline } from 'react-icons/md';

const Members = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        nativePlace: '',
        accommodation: '',
        status: 'Active',
        college: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Member Data:', formData);
        setIsModalOpen(false);
    };

    return (
        <div className='w-full min-h-[85vh] font-poppins px-[30px] mt-[100px]'>
            {/* Page Details and Options
            <div className='flex justify-between items-center mt-6'>
                <div className='text-[28px] font-semibold'>Members</div>
            </div> */}

            {/* Members Table */}
            <div className='border-[1px] rounded-md p-4 mt-10'>
                {/* Table Heading */}
                <div className='w-full flex justify-between items-center gap-3'>
                    <div className='w-full'>
                        <div className='text-subheading font-semibold max-md:text-[20px]'>Members</div>
                        <p className='text-smallText'>Members of Mess</p>
                    </div>
                    <div className='text-bodyText'>
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
                    <MembersTable />
                </div>
            </div>

            {/* Add Member Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-6 rounded-lg w-[400px] m-2'>
                        <h2 className='text-xl font-semibold mb-4'>Add Member</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                            <input type='text' name='name' placeholder='Name' value={formData.name} onChange={handleChange} className='border p-2 rounded'/>
                            <input type='text' name='mobile' placeholder='Mobile Number' value={formData.mobile} onChange={handleChange} className='border p-2 rounded'/>
                            <input type='text' name='nativePlace' placeholder='Native Place' value={formData.nativePlace} onChange={handleChange} className='border p-2 rounded'/>
                            <input type='text' name='accommodation' placeholder='Accommodation Address' value={formData.accommodation} onChange={handleChange} className='border p-2 rounded'/>
                            <select name='status' value={formData.status} onChange={handleChange} className='border p-2 rounded'>
                                <option value='Active'>Active</option>
                                <option value='Not Active'>Not Active</option>
                            </select>
                            <input type='text' name='college' placeholder='College' value={formData.college} onChange={handleChange} className='border p-2 rounded'/>
                            <div className='flex justify-end gap-2 mt-4'>
                                <button type='button' onClick={() => setIsModalOpen(false)} className='bg-gray-400 text-white px-3 py-2 rounded'>Close</button>
                                <button type='submit' className='bg-primary text-white px-3 py-2 rounded'>Send Mail</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;