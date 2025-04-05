import React, { useContext, useEffect, useState } from 'react'
import PaymentsTable from '../../components/PaymentsTable'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DatePicker, Tabs } from 'antd'
import { MessContext } from '../../GlobalContext/Context'
import { useNavigate } from 'react-router-dom'

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Payments = () => {
  const [paymentHistory, setPaymentHistory] = useState([])
  const [duePayments, setDuePayments] = useState([])
  const [searchedPayments, setSearchedPayments] = useState([])
  const [activeTab, setActiveTab] = useState('previous')
  const [dateRange, setDateRange] = useState(null)
  const {role, setIsLogin} = useContext(MessContext)
  const Navigate = useNavigate()

  useEffect(() => {
    fetchPaymentDetails()
  }, [])

  
    useEffect(() => {
      if (role != 'user') {
        toast.error('Not authorized');
        sessionStorage.clear();
        setIsLogin(false);
        Navigate('/');
      }
    }, [])

  const fetchPaymentDetails = async () => {
    try {
      // Fetch payment history
      const historyResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/getPaymentHistory`, {
        mobileNumber: sessionStorage.getItem('mobileNumber')
      });
      
      // Fetch due payments
      const dueResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/getDuePayments`, {
        mobileNumber: sessionStorage.getItem('mobileNumber')
      });
      
      if (historyResponse.data.success && dueResponse.data.success) {
        setPaymentHistory(historyResponse.data.data);
        setDuePayments(dueResponse.data.data);
        setSearchedPayments(historyResponse.data.data);
      } else {
        toast.error('Failed to fetch payment details');
      }
    } catch (err) {
      console.log(err);
      toast.error('Error in fetching payment details');
    }
  }

  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
    setDateRange(null);
    if (activeKey === 'previous') {
      setSearchedPayments(paymentHistory);
    } else {
      setSearchedPayments(duePayments);
    }
  }

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      const [startDate, endDate] = dates;
      // Get the correct data source based on active tab
      const dataSource = activeTab === 'previous' ? paymentHistory : duePayments;
      
      // Filter the data based on the selected date range
      const filteredData = dataSource.filter(payment => {
        const paymentDate = new Date(payment.startDate);
        return paymentDate >= startDate.startOf('day').toDate() && 
               paymentDate <= endDate.endOf('day').toDate();
      });
      setSearchedPayments(filteredData);
    } else {
      // If no date range is selected, show all data for the active tab
      setSearchedPayments(activeTab === 'previous' ? paymentHistory : duePayments);
    }
  };

  const calculateTotalAmount = (payments) => {
    return payments.reduce((total, payment) => total + (payment.Due!=0 ? payment.Due : payment.paidAmount), 0).toFixed(2);
  }

  return (
    <div className='w-full min-h-[60vh] font-poppins px-[30px] mt-[80px]'>
      {/* Payment Details Container */}
      <div className='border-[1px] border-gray-400 rounded-md mt-4 p-4'>
        {/* heading */}
        <div>
          <p className='text-[20px] font-semibold'>My Payments</p>
          <p className='text-gray-600 text-[14px]'>View your payment history and upcoming payments</p>
        </div>

        {/* Tabs for Previous and Due Payments */}
        <Tabs defaultActiveKey="previous" onChange={handleTabChange} className="mt-4">
          <TabPane tab="Previous Payments" key="previous">
            <div className='flex justify-between items-center mt-4 px-2 flex-wrap gap-2'>
              {/* Summary */}
              <div>
                <p className='text-gray-600'>
                  Total Paid: <span className='font-semibold text-green-600'>${calculateTotalAmount(paymentHistory)}</span>
                </p>
              </div>

              {/* date range picker */}
              <div className='text-bodyText'>
                <RangePicker 
                  onChange={handleDateRangeChange}
                  className='border p-2 rounded-md'
                  placeholder={['Start Date', 'End Date']}
                  format="YYYY-MM-DD"
                  value={dateRange}
                />
              </div>
            </div>

            {/* Payments Table */}
            <div className='mt-4'>
              <PaymentsTable 
                payments={searchedPayments} 
                isPreviousPayments={true} 
              />
            </div>
          </TabPane>

          <TabPane tab="Due Payments" key="due">
            <div className='flex justify-between items-center mt-4 px-2 flex-wrap gap-2'>
              {/* Summary */}
              <div>
                <p className='text-gray-600'>
                  Total Due: <span className='font-semibold text-red-600'>${calculateTotalAmount(duePayments)}</span>
                </p>
              </div>

              {/* date range picker */}
              <div className='text-bodyText'>
                <RangePicker 
                  onChange={handleDateRangeChange}
                  className='border p-2 rounded-md'
                  placeholder={['Start Date', 'End Date']}
                  format="YYYY-MM-DD"
                  value={dateRange}
                />
              </div>
            </div>

            {/* Due Payments Table */}
            <div className='mt-4'>
              <PaymentsTable 
                payments={searchedPayments} 
                isPreviousPayments={false} 
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Payments
