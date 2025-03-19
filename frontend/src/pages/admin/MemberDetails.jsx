import React from 'react'
import { IoMdArrowBack } from "react-icons/io";

const MemberDetails = () => {

    const [subscriptionStatus, setSubscriptionStatus] = React.useState('active');
    const handleGoBack = () => {
        window.history.back(); 
    }

    return (
        <div className='min-h-[60vh] w-full mt-[80px] font-poppins px-[30px]'>
            <div className='border-[1px]  rounded-md mt-4 p-4 '>
                <div className=' border-gray-400  px-[10px]'>
                    <div className='3ext-[26px] font-semibold flex gap-2 items-center'>
                        {/* <div className='flex gap-1 items-center hover:cursor-pointer hover:bg-gray-100 rounded-full p-2 '>
                            <IoMdArrowBack size={20} />
                            <p>Back</p>
                        </div> */}
                        <div className='text-subheading font-semibold py-1 flex items-center px-2 cursor-pointer hover:bg-gray-100 rounded-xl'>
                            <IoMdArrowBack/>
                            <p onClick={handleGoBack}>Back</p>
                        </div>
                    </div>
                    <div className='flex gap-3 max-xl:gap-6 mt-4 flex-wrap w-full'>
                        <div className='w-[69%] max-[1400px]:w-full rounded-md border-[1px] border-gray-400 px-4 py-2 '>
                            <div className='text-[20px] font-semibold border-b-[1px] p-1 border-gray-300'>Member Details</div>
                            <div className='w-full flex flex-col gap-4 mt-4'>
                                <div className='flex gap-3 items-center max-md:flex-wrap'>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="name" className='text-[14px]'>Name</label>
                                        <input type="text" placeholder='Name' className='w-full border-[1px] border-gray-300 p-2 rounded-md' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="mobileNumber" className='text-[14px]'>Mobile Number</label>
                                        <input type="number" placeholder='Mobile Number' className='w-full border-[1px] border-gray-300 p-2 rounded-md' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="address" className='text-[14px]'>Join Date</label>
                                        <input type="date" placeholder='Join Date' className='w-full border-[1px] border-gray-300 p-2 rounded-md' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="address" className='text-[14px]'>Start Date</label>
                                        <input type="date" placeholder='Join Date' className='w-full border-[1px] border-gray-300 p-2 rounded-md' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <p className='text-[14px]'>Total Meals</p>
                                        <div className='w-full border-[1px] border-gray-300 p-2 rounded-md'>
                                            2
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <p className='text-[14px]'>Meals Skipped</p>
                                        <div className='w-full border-[1px] border-gray-300 p-2 rounded-md'>
                                            2
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>

                                        <div htmlFor="address" className='text-[14px]'>Subscription Status : <span className={`${subscriptionStatus === 'active' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'} text-bodyText`}>Active</span></div>
                                    </div>

                                </div>

                                <div className='flex justify-end items-center max-md:flex-wrap gap-2'>
                                    <div className=' p-2 rounded-md max-md:w-full text-center bg-green-600 text-white px-[20px] text-[14px] mr-2 cursor-pointer hover:bg-green-700'>Activate Subscription</div>
                                    <div className='p-2 rounded-md bg-blue-600 text-white px-[20px] text-[14px] mr-2 cursor-pointer hover:bg-blue-700 max-md:w-full text-center'>Save</div>
                                </div>
                            </div>
                        </div>
                        <div className='w-[30%] max-[1400px]:w-full rounded-md border-[1px] border-gray-400 p-2 relative'>
                            <div className='text-[20px] font-semibold border-b-[1px] p-1 border-gray-300'>Bill Summary</div>
                            {/* Meals Summary  */}
                            <div className='mt-4'>
                                <div className='flex justify-between items-center p-2 border-b-[1px] border-gray-200 gap-4'>
                                    <p>Total Meals</p>
                                    <p>2</p>
                                </div>
                                <div className='flex justify-between items-center p-2 border-b-[1px] bg-green-100 gap-4'>
                                    <p>Total Meals Amount</p>
                                    <p>200</p>
                                </div>
                                <div className='flex justify-between items-center p-2 border-b-[1px]  gap-4'>
                                    <p>Meals Skipped</p>
                                    <p>3</p>
                                </div>
                                <div className='flex justify-between items-center p-2 border-b-[1px]  bg-rose-100 gap-4'>
                                    <p>Money Deducted</p>
                                    <p>10</p>
                                </div>
                                <div className='flex justify-between items-center p-2 border-t-[1px]  mt-4 gap-4 mb-16'>
                                    <p>Total Amount</p>
                                    <p>10</p>
                                </div>
                                <div className='absolute bottom-2 right-2 left-2 flex justify-center items-center p-2 bg-green-500 rounded-md text-white cursor-pointer hover:bg-green-600'>
                                    Paid
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MemberDetails
