import { Table } from "antd";
import React from 'react'

const PendingAdminDashTable = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
    },
    {
      title: 'Place',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Accommodation',
      dataIndex: 'accommodation',
      key: 'accommodation',
    },
    {
      title: 'College',
      dataIndex: 'college',
      key: 'college',
    },
    {
      title: 'Pending Amount',
      dataIndex: 'pendingAmount',
      key: 'pendingAmount',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Rahul Sharma',
      mobileNumber: '9876543210',
      place: 'Pune',
      accommodation: 'Hostel',
      college: 'MIT Pune',
      pendingAmount: 2000,
    },
    {
      key: '2',
      name: 'Sneha Patil',
      mobileNumber: '9123456789',
      place: 'Mumbai',
      accommodation: 'PG',
      college: 'IIT Bombay',
      pendingAmount: 1500,
    },
    {
      key: '3',
      name: 'Amit Verma',
      mobileNumber: '9988776655',
      place: 'Bangalore',
      accommodation: 'Rented Apartment',
      college: 'RV College of Engineering',
      pendingAmount: 1000,
    },
  ];

  return (
    <div className='w-full overflow-auto'>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default PendingAdminDashTable;