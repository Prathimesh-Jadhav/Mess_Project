import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Select, Spin, Empty } from 'antd';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify'

const MemberDetails = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState('active');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [monthlyBills, setMonthlyBills] = useState(
        []
    );
    const [currentBill, setCurrentBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [amountPaid, setAmountPaid] = useState(0);
    const [memberDetais, setMemberDetails] = useState({});
    const [billOptions, setBillOptions] = useState([]);

    const { id } = useParams();


    useEffect(() => {
        if (sessionStorage.getItem('role') != 'admin') {
            toast.error('Not authorized');
            sessionStorage.clear();
            window.location.href = '/';
        }
    }, [])



    // Mock function to fetch bills - replace with your actual API call
    const fetchMemberBills = async (memberId) => {
        setLoading(true);
        try {
            // Replace this with your actual API endpoint
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/paymentDetails`, { mobileNumber: id });
            if (response.data.success) {
                setMonthlyBills(response.data.data);

                //filter the bills whose due !=0
                const filteredBills = response.data.data.filter(bill => bill.Due !== 0);
                //sort the bills by start date in descending order
                const sortedBills = filteredBills.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

                setBillOptions(sortedBills);
                // Set the most recent bill as default
                if (response.data.data.length > 0) {
                    setSelectedMonth(`${sortedBills[0]?.startDate?.split('T')[0]} - ${sortedBills[0]?.endDate?.split('T')[0]}`);
                    setCurrentBill(sortedBills[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching bills:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get member ID from URL
    useEffect(() => {
        const memberId = window.location.pathname.split('/').pop();
        if (memberId) {
            fetchMemberBills(memberId);
        }

        getMemberDetails();
    }, []);

    const getMemberDetails = async () => {
        try {
            const mealDetails = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/meal/getMealDetails`, { mobileNumber: id })
            if (!mealDetails) {
                toast.error('error fetching members')
                return;
            }
            setMemberDetails(mealDetails.data.data)
        }
        catch (err) {
            console.log(err);
            toast.error('error fetching members')
        }
    }

    // Update current bill when selected month changes
    useEffect(() => {
        if (selectedMonth && monthlyBills.length > 0) {
            const bill = monthlyBills.find(bill => bill.startDate.split('T')[0] === selectedMonth.split(' ')[0] && bill.endDate.split('T')[0] === selectedMonth.split(' ')[2]);
            setCurrentBill(bill);
        }
    }, [selectedMonth]);

    const handleGoBack = () => {
        window.history.back();
    };

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
    };

    const activateSubscription = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/members/updateMembers`, { mobileNumber: id, status: 'Active', subscibedAt: new Date().toISOString().split('T')[0] });
            if (response.data.success) {
                toast.success('subscription activated successfully');
                setSubscriptionStatus('Active')
                getMemberDetails();
            }
        }
        catch (err) {
            console.log(err);
            toast.error('error in activating subscription');
        }
    }


    const handlePayment = async (e) => {
        e.preventDefault();
        const startDate = selectedMonth.split(' ')[0];
        const endDate = selectedMonth.split(' ')[2];
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/payments/amountPaid`, { mobileNumber: id, paidAmount: amountPaid, startDate, endDate, amount: currentBill.Due,totalMealsHad: currentBill.totalMealsHad, mealsSkipped: currentBill.mealsSkipped, totalAmount: currentBill.totalAmount, deductedAmount: currentBill.deductedAmount });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchMemberBills(id);
                setAmountPaid(0);
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <div className='min-h-[60vh] w-full mt-[80px] font-poppins px-[30px]'>
            <div className='border-[1px] rounded-md mt-4 p-4'>
                <div className='border-gray-400 px-[10px]'>
                    <div className='flex gap-2 items-center'>
                        <div className='text-subheading font-semibold py-1 flex items-center px-2 cursor-pointer hover:bg-gray-100 rounded-xl'>
                            <IoMdArrowBack />
                            <p onClick={handleGoBack}>Back</p>
                        </div>
                    </div>
                    <div className='flex gap-3 max-xl:gap-6 mt-4 flex-wrap w-full'>
                        <div className='w-[69%] max-[1400px]:w-full rounded-md border-[1px] border-gray-400 px-4 py-2'>
                            <div className='text-[20px] font-semibold border-b-[1px] p-1 border-gray-300'>Member Details</div>
                            <div className='w-full flex flex-col gap-4 mt-4'>
                                <div className='flex gap-3 items-center max-md:flex-wrap'>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="name" className='text-[14px]'>Name</label>
                                        <input type="text" placeholder='Name' className='w-full border-[1px] border-gray-300 p-2 rounded-md' value={memberDetais?.name || ""} />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="mobileNumber" className='text-[14px]'>Mobile Number</label>
                                        <input type="number" placeholder='Mobile Number' className='w-full border-[1px] border-gray-300 p-2 rounded-md' value={memberDetais?.mobileNumber || ""} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="address" className='text-[14px]'>Join Date</label>
                                        <input type="date" placeholder='Join Date' className='w-full border-[1px] border-gray-300 p-2 rounded-md' value={memberDetais?.joinDate?.split('T')[0] || ""} />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <label htmlFor="address" className='text-[14px]'>Start Date</label>
                                        <input type="date" placeholder='Join Date' className='w-full border-[1px] border-gray-300 p-2 rounded-md' value={memberDetais?.startDate?.split('T')[0] || ""} />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <p className='text-[14px]'>Total Meals</p>
                                        <div className='w-full border-[1px] border-gray-300 p-2 rounded-md' >
                                            {memberDetais ? memberDetais.totalMealsHad : '0'}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <p className='text-[14px]'>Meals Skipped</p>
                                        <div className='w-full border-[1px] border-gray-300 p-2 rounded-md'>
                                            {memberDetais ? memberDetais.mealsSkippedContinuously : '0'}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <div htmlFor="address" className='text-[14px]'>Subscription Status : <span className={`${memberDetais?.status === 'Active' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'} text-bodyText`}>{memberDetais?.status}</span></div>
                                    </div>
                                </div>

                                <div className='flex justify-end items-center max-md:flex-wrap gap-2'>
                                    <div
                                        className={`p-2 rounded-md max-md:w-full text-center bg-green-600 text-white px-[20px] text-[14px] mr-2 ${memberDetais?.status === 'Active' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-green-700'}`}
                                        onClick={memberDetais?.status === 'Active' ? null : activateSubscription}
                                    >
                                        Activate Subscription
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-[30%] max-[1400px]:w-full rounded-md border-[1px] border-gray-400 p-2 relative'>
                            <div className='text-[20px] font-semibold border-b-[1px] p-1 border-gray-300 mb-4'>Bill Summary</div>

                            {/* Month Selection Dropdown */}
                            <div className='mb-4'>
                                <label className='block text-[14px] mb-1'>Select Month Range</label>
                                <Select
                                    className='w-full'
                                    placeholder="Select month"
                                    onChange={handleMonthChange}
                                    value={selectedMonth}
                                    options={billOptions.map(bill => ({
                                        value: `${bill.startDate?.split('T')[0]} To ${bill.endDate?.split('T')[0]}`,
                                        label: `${bill.startDate?.split('T')[0]} To ${bill.endDate?.split('T')[0]}`
                                    }))}
                                    notFoundContent={loading ? <Spin size="small" /> : <Empty description="No bills found" />}
                                />
                            </div>

                            {/* Bill Summary */}
                            {loading ? (
                                <div className='flex justify-center items-center p-10'>
                                    <Spin />
                                </div>
                            ) : currentBill ? (
                                <div className='mt-4 pb-16'>
                                    <div className='flex justify-between items-center p-2 border-b-[1px] border-gray-200 gap-4'>
                                        <p>Total Meals of this Month</p>
                                        <p>{currentBill.totalMealsHad}</p>
                                    </div>
                                    <div className='flex justify-between items-center p-2 border-b-[1px] bg-green-100 gap-4'>
                                        <p>Total Amount</p>
                                        <p>₹{currentBill.totalAmount}</p>
                                    </div>
                                    <div className='flex justify-between items-center p-2 border-b-[1px] gap-4'>
                                        <p>Meals Skipped in Payment</p>
                                        <p>{currentBill.mealsSkipped*8} <span className='text-rose-600'>(Eff: {currentBill.mealsSkipped})</span></p>
                                    </div>
                                    <div className='flex justify-between items-center p-2 border-b-[1px] bg-rose-100 gap-4'>
                                        <p>Money Deducted</p>
                                        <p>₹{currentBill.deductedAmount}</p>
                                    </div>
                                    <div className='flex justify-between items-center p-2 border-t-[1px] mt-4 gap-4 mb-16 font-semibold'>
                                        <p>Total Amount</p>
                                        <p>₹{currentBill.amountToPay}</p>
                                    </div>

                                    <div className='flex justify-between items-center p-2 border-b-[1px] gap-4'>
                                        <div className='flex gap-1'>
                                            <p>Due:</p>
                                            <p className='text-rose-600'>₹{currentBill.Due}</p>
                                        </div>
                                        <input
                                            type="number"
                                            placeholder='Amount Paid'
                                            className='w-1/2 border-[1px] border-gray-300 p-1 rounded-md text-right'
                                            onChange={(e) => setAmountPaid(e.target.value)}
                                            value={amountPaid ? amountPaid : 'amount Paid'}
                                        />
                                    </div>

                                    <div className={`absolute bottom-2 right-2 left-2 flex justify-center items-center p-2 ${currentBill.isPaid ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} rounded-md text-white  ${amountPaid ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'   }`} onClick={handlePayment}>
                                        {currentBill.isPaid ? 'Paid' : 'Pay Now'}
                                    </div>
                                </div>
                            ) : (
                                <div className='flex justify-center items-center p-10'>
                                    <Empty description="No bill data available" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetails;